
## Coding Strategy
1. No `Controller` to handle req, res.
2. Define `Provider` : `resolver` (.resolver.ts) 🡪 for gql and invoke fn from service, just like you define `controller`(.controller.ts) in the beginning if building a restful api.
3. Define `Provider` : `service` (.service.ts) 🡪 handle mongodb by mongoose instance (./schemas/posts.schema.ts)
4. Throw Exception: `class-validator` see [docs](https://docs.nestjs.com/pipes#class-validator)

## GQL exapmles
    see http://localhost:3000/graphql

#### Query
```gql
  query {
    getPosts (input: {
      page: 1,
      pageSize: 2,
    }) {
      total
      page
      pageSize
    }
  }

  # response
  {
    "data": {
      "getPosts": {
        "total": "1",
        "page": 1,
        "pageSize": 2
      },
    }
  }
```

#### Mutation

##### Mutation by input
###### createPost w/ success
```gql
  mutation {
    createPost( 
      input: {
      posterUrl: "https://hihi.com",
      title: "title",
      summary: "sum",
      content: "content",
      tags: ["this","is", "array"],
      lastModifiedDate: "2022-01-21"
     }
    ) {
      _id
      title
    }
  }
```
###### createPost w/ bad input
```gql
mutation {
  createPost (
    input : {
			posterUrl: "000000000",  # not valid URL
      title: "11- test for invalide URL", # should shorter than 20
      summary: "summary of sth",
      content: "dummy content",
      tags: ["validate", "custom", "global"],
      lastModifiedDate: "2022-01-22"
    }
  ) {
    _id
    posterUrl
  }
}

#response
{
  "errors": [
    {
      "message": "posterUrl must be an URL address; title must be shorter than or equal to 20 characters",
    }
  ]
}
```

##### Mutation by id
###### updateLike
```gql
mutation {
  updateLike(id: "some-id") {
    _id
    like
  }
}

#response
{
  "data": {
    "updateLike": {
      "_id": "some-id",
      "like": 1,
    }
  }
}
```

###### deletePosts
```gql
mutation {
	deletePosts(ids: ["fakeID", "UncorrectID"]) {
    ids
    deletedCount
  } 
}

#response
{
  "data": {
    "deletePosts": {
      "ids": [
        "fakeID",
        "UncorrectID"
      ],
      "deletedCount": 0
    }
  }
}
```