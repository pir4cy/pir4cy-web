package handlers

import (
	"encoding/json"
	"html/template"
	"net/http"
	"path/filepath"
	"sort"
	"strings"
	"time"

	"github.com/gomarkdown/markdown"
	"github.com/gorilla/mux"
)

type Post struct {
	Slug        string    `json:"slug"`
	Title       string    `json:"title"`
	Date        time.Time `json:"date"`
	Content     string    `json:"content"`
	Excerpt     string    `json:"excerpt"`
	Tags        []string  `json:"tags"`
	Author      string    `json:"author"`
	CoverImage  string    `json:"coverImage"`
	ReadingTime int       `json:"readingTime"`
}

func HandleBlog(w http.ResponseWriter, r *http.Request) {
	posts, err := loadBlogPosts()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	data := map[string]interface{}{
		"Title":       "Blog",
		"Description": "Thoughts, tutorials, and insights on software engineering and cybersecurity",
		"Posts":       posts,
	}

	templates["blog.html"].Execute(w, data)
}

func HandleBlogPost(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	slug := vars["slug"]

	post, err := loadBlogPost(slug)
	if err != nil {
		http.Error(w, "Post not found", http.StatusNotFound)
		return
	}

	data := map[string]interface{}{
		"Title":       post.Title,
		"Description": post.Excerpt,
		"Post":        post,
	}

	templates["blog-post.html"].Execute(w, data)
}

func HandleBlogSearch(w http.ResponseWriter, r *http.Request) {
	query := r.FormValue("q")
	posts, err := searchBlogPosts(query)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	templates["blog-list.html"].Execute(w, posts)
}

// Helper functions
func loadBlogPosts() ([]Post, error) {
	// Implementation for loading blog posts from markdown files
	// This would read from the content directory and parse markdown files
	return nil, nil
}

func loadBlogPost(slug string) (*Post, error) {
	// Implementation for loading a single blog post
	return nil, nil
}

func searchBlogPosts(query string) ([]Post, error) {
	// Implementation for searching blog posts
	return nil, nil
}