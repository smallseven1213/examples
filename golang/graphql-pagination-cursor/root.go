package gql

import (
	"context"
	"fmt"

	"**/routers/gql/mutations/article"

	"**/routers/gql/queries"

	"**/routers/gql/mutations/board"

	"**/routers/gql/mutations/auth"

	"**p/pkg/util"

	"github.com/gin-gonic/gin"
	"github.com/graphql-go/graphql"
	"github.com/graphql-go/handler"
)

// root mutation
var rootMutation = graphql.NewObject(graphql.ObjectConfig{
	Name: "RootMutation",
	Fields: graphql.Fields{
		"login":         gqlMutationAuth.Login,
		"signup":        gqlMutationAuth.Signup,
		"doSignup":      gqlMutationAuth.DoSignup,
		"logout":        gqlMutationAuth.Logout,
		"createBoard":   gqlMutationBoard.Create,
		"createArticle": gqlMutationArticle.Create,
	},
})

// root query
var rootQuery = graphql.NewObject(graphql.ObjectConfig{
	Name: "RootQuery",
	Fields: graphql.Fields{
		"movies": gqlQueries.Movies,
	},
})

// define schema, with our rootQuery and rootMutation
var schema, _ = graphql.NewSchema(graphql.SchemaConfig{
	Query:    rootQuery,
	Mutation: rootMutation,
})

func executeQuery(query string, schema graphql.Schema) *graphql.Result {
	result := graphql.Do(graphql.Params{
		Schema:        schema,
		RequestString: query,
	})
	return result
}

func GraphqlHandler() gin.HandlerFunc {
	h := handler.New(&handler.Config{
		Schema: &schema,
		Pretty: true,
	})

	return func(c *gin.Context) {
		r := c.Request
		claims, claimsIsExisted := c.Get("claims")
		userToken, userTokenIsExisted := c.Get("token")

		claimsWithToken := &util.ClaimsWithToken{}

		if claimsIsExisted {
			claimsWithToken.UID = claims.(*util.Claims).UID
		}

		if userTokenIsExisted {
			claimsWithToken.Token = userToken.(string)
		}

		ctx := context.WithValue(r.Context(), "claims", claimsWithToken)

		h.ServeHTTP(c.Writer, r.WithContext(ctx))
	}
}
