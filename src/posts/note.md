
## Coding Strategy
1. No `Controller` to handle req, res.
2. Define `Provider` : `resolver` (.resolver.ts) 🡪 for gql and invoke fn from service, just like you define `controller`(.controller.ts) in the beginning if building a restful api.
3. Define `Provider` : `service` (.service.ts) 🡪 handle mongodb by mongoose instance (./schemas/posts.schema.ts)

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