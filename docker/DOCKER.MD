## Docker compose
Here you will find documentation about the setup of a full stack for storywise.

The docker-compose.yml can be used to spin up a instance of storywise aswell as a mongodb database

# Environment Variable
In order to start the stack, you'll have to create a .env file and fille it with the following environment variables:

 - TZ=Europe/Brussels
 - DATABASE_NAME=storywisedb
 - USERNAME=admin
 - PASSWORD=123
 - API_BASE_URL=http://demo.example.com
 - MONGO_INITDB_ROOT_USERNAME=db_username
 - MONGO_INITDB_ROOT_PASSWORD=db_password
