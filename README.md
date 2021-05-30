# api-auto-schema
This is an small api that I developed for the bootcamp of the infnet institute. Using a json document for storage of data.

Why uses this api for test?

This api can store data using a json file. But you can create yours schema
and the api will auto create yours routes. Easy use!


| Command|Arguments|Action |
| - |:-:| -:|
| about | about \<database\> | show a info about a command and show all commands, if typed without arguments |
| create | create \<database\> | create a collection |
| drop| drop \<database\> | delete a collection and its configuration|
| tag| tag \<database\> \<generateall\> or \<none\> \<tags separed by comma\> |Create a tags field in json document, to advanced search|
| relation| relation \<father\> \<child\> \<key\>| Create a relation between father and child collections|
| language| language \<filename\>|Sets the language|
| remove| remove \<collection\> \<tag or relation\>|Remove a relation or a tag of a especify collection.|
| clear| clear \<collection\>|Clear a collection|

When you create a collection, the api enables the syntax for these routes:


| Route|verb|Action |
| - |:-:| -:|
| /v1/{collection} | get | get all collection data |
| v1/{collection}/:id | get |get a specific collection data|
| v1/{collection}/:id | delete |delete a specific collection data|
| v1/{collection} | put | update a collection data|
| v1/{collection} | post | create a collection data|
| v1/{collection}/extra | get | advanced relational get data. To this route works, you needs provides the relational table names in query param. You can pass a specific id to search for a specific data its collection.|
| v1/{collection}/search | get | advanced relational get data based on search tags. For this route to work, you can  provide the relational table names in the relations param. You need to pass the tags that you want to find in query param. All these params needs be inserted in the url|



