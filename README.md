# bootcamp-small-blog-api
This is an small api that I developed for the bootcamp of the infnet institute. Using a json document for storage of data.

why uses this api for test?

This api can store data using a json file. But you can create yours schema
and the api will auto create yours routes. Easy use!

This api have  a tag generator system for advanced search(need refactor)

| Command|Arguments|Action |
| - |:-:| -:|
| about | no args | show about this project |
| create | name(string) | create a document |
| drop| name(string) | delete a document|
| tag| document(string) fields (separed by spaces)|Create a tags field in json document, to easy search|
| relation| document father(string) document child(string) relation field key(string)| Create a relation between father document and child document using a relation field key|

