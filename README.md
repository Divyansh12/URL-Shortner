# URL-Shortner
A URL shortner which also tracks the visits to the URL redirected.

# How to start?
First open the server.js file from node, like: 
 > node server.js

Then go to http://localhost:3000/url (localhost will be changed to the domain url) to get to the URL-tool.

Enter the website link and get the shortened url.

# Database
The current database is MySQL. You will need XAMPP to see the data.

Working on shifting to MongoDB.

# Completion
The project is not complete yet. A few problems are: 

    - Haven't checked for empty urls.
    - Haven't checked for inputs. (currently "http://" is prepended to all the urls irresepective if they have it or not.)
    - Not all the information requested has been logged.

I am working on these problems as of now. 