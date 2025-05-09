package main

import (
	"embed"
	"html/template"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
)

//go:embed templates/* static/* content/*
var content embed.FS

var (
	templates map[string]*template.Template
)

func init() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Printf("No .env file found: %v", err)
	}

	// Initialize templates
	if err := initTemplates(); err != nil {
		log.Fatal(err)
	}
}

func initTemplates() error {
	templates = make(map[string]*template.Template)

	// Custom template functions
	funcMap := template.FuncMap{
		"formatDate": formatDate,
		"markdown":   renderMarkdown,
	}

	// Walk through templates directory
	err := filepath.Walk("templates", func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}

		// Skip directories and non-template files
		if info.IsDir() || !strings.HasSuffix(path, ".html") {
			return nil
		}

		// Parse template with base layout
		tmpl, err := template.New(filepath.Base(path)).
			Funcs(funcMap).
			ParseFiles("templates/layout.html", path)
		if err != nil {
			return err
		}

		templates[filepath.Base(path)] = tmpl
		return nil
	})

	return err
}

func main() {
	r := mux.NewRouter()

	// Static file server
	fs := http.FileServer(http.Dir("static"))
	r.PathPrefix("/static/").Handler(http.StripPrefix("/static/", fs))

	// Routes
	r.HandleFunc("/", handleHome)
	r.HandleFunc("/blog", handleBlog)
	r.HandleFunc("/blog/{slug}", handleBlogPost)
	r.HandleFunc("/projects", handleProjects)
	r.HandleFunc("/about", handleAbout)
	r.HandleFunc("/contact", handleContact)

	// API routes for HTMX
	r.HandleFunc("/api/blog/search", handleBlogSearch).Methods("POST")
	r.HandleFunc("/api/blog/filter", handleBlogFilter).Methods("POST")
	r.HandleFunc("/api/contact", handleContactSubmit).Methods("POST")

	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}

	log.Printf("Server starting on port %s", port)
	log.Fatal(http.ListenAndServe(":"+port, r))
}