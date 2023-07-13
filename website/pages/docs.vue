<script lang="ts" setup>
definePageMeta({
  layout: false,
});
</script>

<template>
  <NuxtLayout name="docs">
    <template #sidebar>
      <ul class="menu p-4 w-80 h-full bg-base-100 text-accent-content border-r-2 border-base-200">
        <!-- Sidebar content here -->
        <li><a href="#getting-started">Getting started</a></li>
        <li><a href="#deploy-cloud">Deploy in the cloud (free*)</a></li>
        <li><a href="#resources">Resources</a></li>
        <li><a href="#environment-variables">Environment variables</a></li>
        <li><a href="#deploy-docker-compose">Deploy with docker-compose</a></li>
        <li><a href="#deploy-kubernetes">Deploy on Kubernetes</a></li>
        <li><a href="#embed">Embed</a></li>
        <li><a href="#contributions">Contributions</a></li>
      </ul>
    </template>

    <div class="prose prose-stone py-8 px-8 lg:px-16 max-w-4xl m-auto ">
      <h1 class="serif">Documentation</h1>
      <h2 id="getting-started">Getting started</h2>
      <p>You'll only need the following to get started:</p>

      <p>
        <b>MongoDB</b>
        <br />
        We use the simplest most popular document database to store data, and yes,
        it'll be good enough for your needs.
      </p>
      <p>
        <b>Hosting</b>
        <br />
        You can host it anywhere you want - we have a <b>container</b> image for
        you to use, a kubernetes deployment template, or you can host it on
        Heroku, or you can host it on your own server. It's up to you.
      </p>

      <h2 id="deploy-cloud">Deploy in the cloud (free*)</h2>


      <b>1. Create a MongoDB database</b>
      <p>The easiest way to start is to get a free database from MongoDB Atlas. They have a generous free tier which comes
        with 512MB of storage. And you can get one an overview of their managed services and get started
        <a href="https://www.mongodb.com/pricing">here</a>.
      </p>

      <b>2. Deploy storywise</b>

      <p>You can choose from a whole host of options to deploy storywise. Some easy options are:</p>
      <ul>
        <li><a href="https://fly.io/">fly.io</a> - free resource allowance which "includes enough usage per month to run a
          small
          full-stack app, full-time, for free"</li>
        <li><a href="https://render.com/">render.com</a> - free tier which (called "Individual") which comes with enough
          resources to run
          various workloads for free</li>
        <li><a href="https://railway.app/">railway.app</a> - similar to render.com, free tier which comes with enough
          resources to run
          various workloads for free</li>
        <li>Container based - either docker or kubernetes</li>
      </ul>

      <p>
        <small>* not guaranteed free, since it entirely depends on how you use the free tiers of various cloud
          services.</small>
      </p>


      <h2 id="resources">Resources</h2>

      <p>
        <b>Live demo:</b>
        <br />
        <a class="whitespace-normal break-all" href="https://demo.joinstorywise.com/admin">
          https://demo.joinstorywise.com/admin
        </a>
        <br>
        Username: <code>admin</code>
        <br>
        Password: <code>123</code>
      </p>
      <p>
        <b>Github repository:</b>
        <br />
        <a class="whitespace-normal break-all" href="https://github.com/dotmethodme/storywise">
          https://github.com/dotmethodme/storywise
        </a>
      </p>

      <p>
        <b>Docker image:</b>
        <br />
        <a class="whitespace-normal break-all" href="https://hub.docker.com/r/mihainueleanu/storywise">
          https://hub.docker.com/r/mihainueleanu/storywise
        </a>
      </p>

      <p>
        <b>Kubernetes deployment template:</b>
        <br />
        <a class="whitespace-normal break-all"
          href="https://github.com/dotmethodme/storywise/blob/main/kubernetes/everything.yaml">
          storywise/blob/main/kubernetes/everything.yaml
        </a>
      </p>

      <p>
        <b>Docker-compose template:</b>
        <br />
        <a class="whitespace-normal break-all"
          href="https://github.com/dotmethodme/storywise/blob/main/docker-compose.yaml">
          storywise/blob/main/docker-compose.yaml
        </a>
      </p>

      <h2 id="environment-variables">Environment variables</h2>

      <div class="overflow-x-scroll">
        <table class="table table-xs">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                MONGODB_URI <br />
                <small>required</small>
              </td>
              <td>
                The connection string to your MongoDB database. You can get this
                from your MongoDB Atlas dashboard.
              </td>
            </tr>
            <tr>
              <td>
                DATABASE_NAME
                <br />
                <small>required</small>
              </td>
              <td>
                The name of the database you want to use. If it doesn't exist, it
                will be created for you.
              </td>
            </tr>
            <tr>
              <td>
                USERNAME
                <br />
                <small>required</small>
              </td>
              <td>The username you want to use to log in to the admin panel.</td>
            </tr>

            <tr>
              <td>
                PASSWORD
                <br />
                <small>required</small>
              </td>
              <td>The password you want to use to log in to the admin panel.</td>
            </tr>

            <tr>
              <td>
                API_BASE_URL
                <br />
                <small>required</small>
              </td>
              <td>
                The base URL of your API. This is used to produce the right URLs for
                the tracking scripts.
              </td>
            </tr>

            <tr>
              <td>NODE_ENV</td>
              <td>
                The environment you're running the app in. If the environment is
                <code>local</code>, the app will be able to preserve certain
                features such as Hot Module Reloading.
              </td>
            </tr>

            <tr>
              <td>ALLOWED_ORIGIN</td>
              <td>
                The origin that browsers are allowed to send requests from. This is
                in effect used as a CORS policy for the API which receives user
                activity events. Default: <code>*</code>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="deploy-docker-compose">Deploy on docker-compose</h2>
      <p>One of the simpler ways to deploy storywise is via docker-compose. This could be especially useful to try it
        out locally. </p>

      <p>
        Start by cloning the repository:

      <div class="overflow-scroll w-full">
        <pre class="break-all whitespace-normal"><code class="language-bash">
          git clone git@github.com:dotmethodme/storywise.git <br/>
          cd storywise
        </code></pre>
      </div>
      </p>

      <p>Make sure to update the environment variables in the docker-compose file with new values relevant for your
        setup:</p>

      <ul>
        <li>MONGODB_URI</li>
        <li>DATABASE_NAME</li>
        <li>USERNAME</li>
        <li>PASSWORD</li>
        <li>API_BASE_URL</li>
      </ul>

      <p>
        Then run:

      <div class="overflow-scroll w-full">
        <pre class="break-all whitespace-normal"><code class="language-bash">
          docker-compose up
        </code></pre>
      </div>
      </p>

      <h2 id="deploy-kubernetes">Deploy on Kubernetes</h2>

      <p>
        You can deploy Storywise on Kubernetes using the following template:
        <br />
        <a class="whitespace-normal break-all"
          href="https://github.com/dotmethodme/storywise/blob/main/kubernetes/everything.yaml">
          storywise/blob/main/kubernetes/everything.yaml
        </a>
      </p>

      <p>
        Start by cloning the repository:

      <div class="overflow-scroll w-full">
        <pre class="break-all whitespace-normal"><code class="language-bash">
          git clone git@github.com:dotmethodme/storywise.git <br/>
          cd storywise/kubernetes
        </code></pre>
      </div>
      </p>

      <p>Make sure to update the ConfigMap and Secret with new values relevant for your setup:</p>

      <ul>
        <li>MONGODB_URI</li>
        <li>DATABASE_NAME</li>
        <li>USERNAME</li>
        <li>PASSWORD</li>
        <li>API_BASE_URL</li>
      </ul>

      <p>Another thing to update is the ingress address: here you want to configure the domain name that you've already
        setup to point to your kubernetes cluster.
      </p>

      <p><i>Note: if you wish to deploy in a namespace other than <code>default</code>
          make sure to update that as well, everywhere in the yaml file</i></p>

      <p>Once that's done, apply the yaml file:</p>
      <pre class="break-all whitespace-normal"><code class="language-bash">kubectl apply -f everything.yaml</code></pre>

      <p>And that's all. The admin panel of Storywise is available at https://your.address.example.com/admin, and you
        can
        login using the credentials you configured in the steps above (USERNAME, and PASSWORD)</p>


      <h2 id="embed">Embed</h2>
      <p>Instructions to embed the analytics script into your website are available under the info tab inside the
        storywise admin (step above):
        <br>
        <a class="whitespace-normal break-all"
          href="https://your.address.example.com/admin">https://your.address.example.com/admin</a>
      </p>

      <p>However, generally speaking the tracking script is available at the following address:

        <br>
        <a class="whitespace-normal break-all"
          href="https://your.address.example.com/js/script.js">https://your.address.example.com/api/script.js</a>
      </p>

      <h2 id="contributions">Contributions</h2>

      <p>The project is going through active development, and obviously, as you might be able to judge by the
        questionable
        quality of this article, the documentation can also be improved</p>

      <p>If you enjoy Storywise, and would like to help, please consider giving back to the project and contributing to
        either the documentation, or the core project itself.</p>

      <p>For any queries, please contact
        <a class="whitespace-normal break-all" href="mailto:hey@joinstorywise.com">
          hey@joinstorywise.com
        </a>
      </p>

      <p>
        Thank you!
      </p>

      <div class="mb-10"></div>
    </div>

  </NuxtLayout>
</template>
