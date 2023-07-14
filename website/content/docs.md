# Documentation

## Getting started

You'll only need the following to get started:

MongoDB  
We use the simplest most popular document database to store data, and yes, it'll be good enough for your needs.

Hosting  
You can host it anywhere you want - we have a container image for you to use, a Kubernetes deployment template, or you can host it on Heroku, or you can host it on your own server. It's up to you.

## Deploy in the cloud (free*)

**1. Create a MongoDB database**  
The easiest way to start is to get a free database from MongoDB Atlas. They have a generous free tier which comes with 512MB of storage. And you can get one an overview of their managed services and get started [here](https://www.mongodb.com/pricing).

**2. Deploy storywise**  
You can choose from a whole host of options to deploy storywise. Some easy options are:
- [fly.io](https://fly.io/) - free resource allowance which "includes enough usage per month to run a small full-stack app, full-time, for free"
- [render.com](https://render.com/) - free tier (called "Individual") which comes with enough resources to run various workloads for free
- [railway.app](https://railway.app/) - similar to render.com, free tier which comes with enough resources to run various workloads for free
- Container based - either docker or Kubernetes

*not guaranteed free, since it entirely depends on how you use the free tiers of various cloud services.*

## Resources

**Live demo:**  
[https://demo.joinstorywise.com/admin](https://demo.joinstorywise.com/admin)  
Username: `admin`  
Password: `123`

**Github repository:**  
[https://github.com/dotmethodme/storywise](https://github.com/dotmethodme/storywise)

**Docker image:**  
[https://hub.docker.com/r/mihainueleanu/storywise](https://hub.docker.com/r/mihainueleanu/storywise)

**Kubernetes deployment template:**  
[/kubernetes/everything.yaml](https://github.com/dotmethodme/storywise/blob/main/kubernetes/everything.yaml)

**Docker-compose template:**  
[/docker-compose.yaml](https://github.com/dotmethodme/storywise/blob/main/docker-compose.yaml)

## Environment variables

| Name           | Description                                                                                                                                                       |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| MONGODB_URI    | The connection string to your MongoDB database. You can get this from your MongoDB Atlas dashboard.                                                               |
| DATABASE_NAME  | The name of the database you want to use. If it doesn't exist, it will be created for you.                                                                        |
| USERNAME       | The username you want to use to log in to the admin panel.                                                                                                        |
| PASSWORD       | The password you want to use to log in to the admin panel.                                                                                                        |
| API_BASE_URL   | The base URL of your API. This is used to produce the right URLs for the tracking scripts.                                                                        |
| NODE_ENV       | The environment you're running the app in. If the environment is `local`, the app will be able to preserve certain features such as Hot Module Reloading.         |
| ALLOWED_ORIGIN | The origin that browsers are allowed to send requests from. This is in effect used as a CORS policy for the API which receives user activity events. Default: `*` |

## Deploy on docker-compose

One of the simpler ways to deploy storywise is via docker-compose. This could be especially useful to try it out locally.

Start by cloning the repository:

```sh
git clone git@github.com:dotmethodme/storywise.git
cd storywise
```


Make sure to update the environment variables in the docker-compose file with new values relevant for your setup:

- MONGODB_URI
- DATABASE_NAME
- USERNAME
- PASSWORD
- API_BASE_URL

Then run:

```sh
docker-compose up
```


## Deploy on Kubernetes

You can deploy Storywise on Kubernetes using the following template:
[storywise/blob/main/kubernetes/everything.yaml](https://github.com/dotmethodme/storywise/blob/main/kubernetes/everything.yaml)

Start by cloning the repository:

```sh
git clone git@github.com:dotmethodme/storywise.git
cd storywise/kubernetes
```


Make sure to update the ConfigMap and Secret with new values relevant for your setup:

- MONGODB_URI
- DATABASE_NAME
- USERNAME
- PASSWORD
- API_BASE_URL

Another thing to update is the ingress address: here you want to configure the domain name that you've already setup to point to your Kubernetes cluster.

*Note: if you wish to deploy in a namespace other than `default`, make sure to update that as well, everywhere in the yaml file*

Once that's done, apply the yaml file:

```sh
kubectl apply -f everything.yaml
```


And that's all. The admin panel of Storywise is available at `https://your.address.example.com/admin`, and you can login using the credentials you configured in the steps above (USERNAME, and PASSWORD).

## Embed

Instructions to embed the analytics script into your website are available under the info tab inside the storywise admin (step above):
[https://your.address.example.com/admin](https://your.address.example.com/admin)

However, generally speaking the tracking script is available at the following address:

[https://your.address.example.com/js/script.js](https://your.address.example.com/api/script.js)

## Contributions

The project is going through active development, and obviously, as you might be able to judge by the questionable quality of this article, the documentation can also be improved.

If you enjoy Storywise, and would like to help, please consider giving back to the project and contributing to either the documentation, or the core project itself.

For any queries, please contact [hey@joinstorywise.com](mailto:hey@joinstorywise.com).

Thank you!
