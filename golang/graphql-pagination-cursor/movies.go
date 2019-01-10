package gqlQueries

import (
	"github.com/graphql-go/graphql"
)

// MovieType
// movie struct
var MovieType = graphql.NewObject(graphql.ObjectConfig{
	Name: "node",
	Fields: graphql.Fields{
		"title": &graphql.Field{
			Type: graphql.String,
		},
		"content": &graphql.Field{
			Type: graphql.String,
		},
	},
})

// MovieEdgeType
// 提供上層MovieCursorType的edges必要的type
// node下才是真正原movie struct type
// cursor才是指標
var MovieEdgeType = graphql.NewObject(graphql.ObjectConfig{
	Name: "edges",
	Fields: graphql.Fields{
		"node": &graphql.Field{
			Type: MovieType,
		},
		"cursor": &graphql.Field{
			Type: graphql.String,
		},
	},
})

// MovieCursorType
// 規範下，應該要提供totalCount, edges與pageInfo
var MovieCursorType = graphql.NewObject(graphql.ObjectConfig{
	Name: "articles",
	Fields: graphql.Fields{
		"totalCount": &graphql.Field{
			Type: graphql.Int,
		},
		"edges": &graphql.Field{
			Type: graphql.NewList(MovieEdgeType),
		},
		"pageInfo": &graphql.Field{
			Type: PageInfoType,
		},
	},
})

// movies查詢入口
// args必須要提供first, after, before等定義
// 本範例只實作2個argument
var Movies = &graphql.Field{
	Type:        MovieCursorType,
	Description: "Get movie list",
	Args: graphql.FieldConfigArgument{
		"first": &graphql.ArgumentConfig{
			Type: graphql.Int,
		},
		"after": &graphql.ArgumentConfig{
			Type: graphql.String,
		},
	},
	Resolve: func(params graphql.ResolveParams) (interface{}, error) {

		// 應該要帶入first index與after cursor等資訊進GetAllMovie
		// 我在設計時將資料存入mongodb，並存儲存當下將cursor寫入
		res := *movieService.GetAllMovie(arg.Name)

		// TotalCount & PageInfo
		lastRes := res[len(res)-1]
		totalCount := movieService.GetCountFromMovie(arg.Name)
		pageInfo := &gqlModels.PageInfo{
			EndCursor:   lastRes.Cursor,
			HasNextPage: false,
		}
		var movieConnection = &gqlModels.MovieConnection{
			TotalCount: totalCount,
			PageInfo:   *pageInfo,
		}

		var movieEdges = &[]gqlModels.MovieEdge{}

		for _, b := range res {
			movieEdge := &gqlModels.MovieEdge{
				Node: gqlModels.Movie{
					Title:   b.Title,
					Content: b.Content,
				},
				Cursor: b.Cursor,
			}
			*movieEdges = append(*movieEdges, *movieEdge)
		}

		movieConnection.Edges = *movieEdges

		return *movieConnection, nil
	},
}
