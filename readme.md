
# Setup Local Vagrant Server
You will need to have the following installed:
1. [vagrant](https://www.vagrantup.com/)
2. [fabric](http://www.fabfile.org/)

```bash
vagrant up
fab vagrant bootstrap
fab vagrant createsuperuser
fab vagrant loaddata
fab vagrant runserver
```

#Setup a Remote Staging/Production Server
## Provision a fresh Server with Chef and Fabric
### Configure server settings
Create a node file with the name scripts/cookbook/node_staging.json from the template in scripts/cookbook/node_staging.json.template.  Set the postgresql password and add your ssh public key to scripts/node_staging.json.  Tested with Ubuntu 12.04 (precise pangolin).

#### Sample config file
```javascript
{
    "user": "www-data",
    "servername": "staging.example.com",
    "dbname": "marine-planner",
    "staticfiles": "/usr/local/apps/marine-planner/mediaroot",
    "mediafiles": "/usr/local/apps/marine-planner/mediaroot",
    "users": [
        {
            "name": "jsmith",
            "key": "ssh-rsa AAAAB3sdkfjhsdkhjfdjkhfffdj.....fhfhfjdjdfhQ== jsmith@machine.local"
        }
    ],
    "postgresql": {
        "password": {
            "postgres": "some random password here"
        }
    },
    "run_list": [
        "marine-planner::default"
    ]
}
```
When first creating a new droplet on digital ocean, you can add ssh keys for users. This will
allows those users to log in as root from there machines with `ssh USERNAME@IP_ADDRESS`.  After the prepare command (see below) runs users will no longer have access to the root login. Instead users will be logged into their own acocunts.  The prepare command creates one or more users with sudo access based on the list of users specified in the json file. If you need to log in as root you will need to reuqest the root password from Digital Ocean.

### Install Prerequisites and Deploy
These commands install all the prerequisites, including postgresql, python and all the required modules in a virtual environment as well as gunicorn and nginx to serve the static files. Try running with 'root' if your username doens't work.
```bash
fab staging:<username>@<hostname> prepare

# Deploy to staging site (by default uses the staging branch)
fab staging:<username>@<hostname> deploy

# Deploy to live site
fab staging:<username>@<hostname> deploy:master


```
## ElasticSearch
Installation is defined in scripts/cookbooks/app/recipes/default.rb

### Start ElasticSearch
```bash
sudo /etc/init.d/elasticsearch start
```
### Build ElasticSearch Index
```bash
cd /usr/local/apps/geosurvey/server
./manage.py rebuild_index --settings=config.environments.staging
```



# Backing up and restoring databases

If you are restoring a live database to your vagrant you should drop and recreate the local datbase before restoring

To drop and recreate
```
vagrant ssh

# Once on the vagrant machine
dropdb geosurvey
createdb -U postgres -T template0 -O postgres geosurvey -E UTF8 --locale=en_US.UTF-8
```


```bash
fab staging:username@162.243.146.75 backup_db
fab staging:username@162.243.146.75 restore_db:backups/2013-11-111755-geosurvey.dump
fab staging:username@162.243.146.75 migrate_db
```

If you get an error in the code - it probably restored
```
[usr@tools.oceanspaces.org:22] out: pg_restore: setting owner and privileges for FK CONSTRAINT user_id_refs_id_990aee10
[usr@tools.oceanspaces.org:22] out: pg_restore: setting owner and privileges for FK CONSTRAINT user_id_refs_id_9a1c674c
[usr@tools.oceanspaces.org:22] out: WARNING: errors ignored on restore: 20
[usr@tools.oceanspaces.org:22] out:


Fatal error: run() received nonzero return code 1 while executing!

Requested: pg_restore --verbose --clean --no-acl --no-owner -U postgres -d geosurvey /tmp/2015-06-26_1101-geosurvey.dump
Executed: /bin/bash -l -c "pg_restore --verbose --clean --no-acl --no-owner -U postgres -d geosurvey /tmp/2015-06-26_1101-geosurvey.dump"

Aborting.
Disconnecting from tools.oceanspaces.org... done.
```

# Running Tests

Unit tests will run whenever you save a file:

```bash
grunt c-unit
```

End to end tests will run whenever you save a file:


```bash
grunt c-e2e
```


# Running managment commands on tools-dev (ost-dev5)
Log into `tools-dev.oceanspaces.org` and run

```
./manage.py COMMAND_NAME --settings=config.environments.staging
```


# Deploying - UPDATED 6/26/2015*
This will take whatever is in you local directory, i.e. it does not pull from github. So make sure to do a `git pull ...` if necessary.


Live site
```
fab staging:wilblack@tools.oceanspaces.org deploy
```

If you're having trouble using the deploy script during pushing, run:
```
git pull tools.oceanspaces.org staging
```

You may also need to load a new database.

```
fab staging:wilblack@tools.oceanspaces.org restore_db:backups/DUMP_FILE

```

Sometimes Elastic Search goes down and the deploy script will break on deployment. If this happens you can try restarting elastic seach.

```
sudo /etc/init.d/elasticsearch restart
```


## Adding a new user using Fab/Chef
1) add the user as normal
2) add the new user the the `depoy` group
    
    usermod -a -G deploy newuser 

3) Replace the new user's .bashrc with the contents of `scripts/apps/tempalates/default/bashrc.erb` replacing the variables `<%= node[:project] %>` with `geosurvey` and `<%= node[:user] %>` with `www-data`.

4) Replace the new user's .profile with the contents of `scripts/apps/files/default/bashrc.erb`

5) Add the users ssh keys to ~/.ssh/authroized_keys

6) restart ssh `service ssh restart`




----

#Heroku (old confuguration) -- DEPRECATED
##requirements
1. Install the heroku toolbelt.
2. Install git > 1.8

##create the heroku app if it doesn't exist
```bash
heroku create appname
```

##login to heroku
```bash
heroku login
```

##set environment vars and install addons.
```bash
heroku config:add DJANGO_SECRET_KEY=SECRET!
heroku addons:add sendgrid
heroku addons:add redistogo
heroku addons:add pgbackups

```

Or run the script from scripts/heroku-env.sh, which is available on google drive for each deployment.

#Deploy

First push the server directory as a subtree from the master branch to heroku.  Then you can use a subtree split to push an alternate branch.

##push the app from the project directory
```bash
git subtree push --prefix server/ heroku master
```

##push an alternate branch from the project directory
```bash
git push heroku `git subtree split --prefix server testbranch`:master
```

##django install
```bash
heroku run python manage.py syncdb --settings=config.environments.heroku
heroku run python manage.py migrate --settings=config.environments.heroku
```

##load some data
```bash
heroku run python manage.py loaddata apps/survey/fixtures/surveys.json --settings=config.environments.heroku
heroku run python manage.py loaddata apps/places/fixtures/marco.json.gz --settings=config.environments.heroku
```

##open the app
```bash
heroku open
```

#manage the heroku database
There is now a management command to capture a backup from heroku and restore it to the vagrant instance.  This will get your development environment up to date with what is currently running on heroku.
```bash
fab vagrant transfer_db
```

##dump a backup
This will dump a compressed binary backup of the current database to a file that can be retrieved as "latest.dump".
```bash
heroku pgbackups:capture
curl -o latest.dump `heroku pgbackups:url`
```

##restore a backup
Transfer the dump file to a web accessible space.  To find the database url, use the pg:info command.
```bash
heroku pg:info
heroku pgbackups:restore HEROKU_POSTGRESQL_WHITE_URL 'http://www.example.org/latest.dump'
```
