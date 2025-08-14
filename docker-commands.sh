#!/bin/bash

# 🐳 HireFlow Docker Management Script
# This script provides easy commands for managing your HireFlow Docker environment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}=== $1 ===${NC}"
}

# Check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker Desktop first."
        exit 1
    fi
    print_status "Docker is running"
}

# Function to show usage
show_usage() {
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  start-prod     Start production environment"
    echo "  start-dev      Start development environment"
    echo "  stop           Stop all services"
    echo "  restart        Restart all services"
    echo "  logs           Show logs for all services"
    echo "  logs-backend   Show backend logs"
    echo "  logs-frontend  Show frontend logs"
    echo "  build          Build all Docker images"
    echo "  build-backend  Build backend image only"
    echo "  build-frontend Build frontend image only"
    echo "  clean          Clean up containers, networks, and volumes"
    echo "  status         Show status of all services"
    echo "  shell-backend  Access backend container shell"
    echo "  shell-frontend Access frontend container shell"
    echo "  shell-db       Access database container shell"
    echo "  backup-db      Create database backup"
    echo "  restore-db     Restore database from backup"
    echo "  help           Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 start-dev"
    echo "  $0 logs-backend"
    echo "  $0 shell-backend"
}

# Start production environment
start_prod() {
    print_header "Starting Production Environment"
    check_docker
    docker-compose up -d
    print_status "Production environment started"
    print_status "Frontend: http://localhost:80"
    print_status "Backend API: http://localhost:8000"
    print_status "API Docs: http://localhost:8000/docs"
}

# Start development environment
start_dev() {
    print_header "Starting Development Environment"
    check_docker
    docker-compose -f docker-compose.dev.yml up -d
    print_status "Development environment started"
    print_status "Frontend: http://localhost:3000"
    print_status "Backend API: http://localhost:8000"
    print_status "API Docs: http://localhost:8000/docs"
}

# Stop all services
stop_services() {
    print_header "Stopping All Services"
    check_docker
    docker-compose down
    docker-compose -f docker-compose.dev.yml down 2>/dev/null || true
    print_status "All services stopped"
}

# Restart services
restart_services() {
    print_header "Restarting Services"
    check_docker
    docker-compose restart
    print_status "Services restarted"
}

# Show logs
show_logs() {
    print_header "Showing Logs for All Services"
    check_docker
    docker-compose logs -f
}

# Show backend logs
show_backend_logs() {
    print_header "Showing Backend Logs"
    check_docker
    docker-compose logs -f backend
}

# Show frontend logs
show_frontend_logs() {
    print_header "Showing Frontend Logs"
    check_docker
    docker-compose logs -f frontend
}

# Build images
build_images() {
    print_header "Building All Docker Images"
    check_docker
    docker-compose build
    print_status "All images built successfully"
}

# Build backend only
build_backend() {
    print_header "Building Backend Image"
    check_docker
    docker-compose build backend
    print_status "Backend image built successfully"
}

# Build frontend only
build_frontend() {
    print_header "Building Frontend Image"
    check_docker
    docker-compose build frontend
    print_status "Frontend image built successfully"
}

# Clean up
clean_up() {
    print_header "Cleaning Up Docker Resources"
    check_docker
    print_warning "This will remove all containers, networks, and volumes. Are you sure? (y/N)"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        docker-compose down -v --rmi all
        docker-compose -f docker-compose.dev.yml down -v --rmi all 2>/dev/null || true
        docker system prune -a --volumes -f
        print_status "Cleanup completed"
    else
        print_status "Cleanup cancelled"
    fi
}

# Show status
show_status() {
    print_header "Service Status"
    check_docker
    docker-compose ps
    echo ""
    print_header "Resource Usage"
    docker stats --no-stream
}

# Access backend shell
shell_backend() {
    print_header "Accessing Backend Container Shell"
    check_docker
    docker-compose exec backend bash
}

# Access frontend shell
shell_frontend() {
    print_header "Accessing Frontend Container Shell"
    check_docker
    docker-compose exec frontend sh
}

# Access database shell
shell_db() {
    print_header "Accessing Database Container Shell"
    check_docker
    docker-compose exec postgres bash
}

# Backup database
backup_db() {
    print_header "Creating Database Backup"
    check_docker
    timestamp=$(date +%Y%m%d_%H%M%S)
    backup_file="backup_${timestamp}.sql"
    docker-compose exec -T postgres pg_dump -U hireflow_user hireflow > "$backup_file"
    print_status "Database backup created: $backup_file"
}

# Restore database
restore_db() {
    print_header "Restoring Database from Backup"
    check_docker
    if [ -z "$1" ]; then
        print_error "Please specify a backup file: $0 restore-db <backup_file>"
        exit 1
    fi
    backup_file="$1"
    if [ ! -f "$backup_file" ]; then
        print_error "Backup file not found: $backup_file"
        exit 1
    fi
    docker-compose exec -T postgres psql -U hireflow_user hireflow < "$backup_file"
    print_status "Database restored from: $backup_file"
}

# Main script logic
case "${1:-help}" in
    start-prod)
        start_prod
        ;;
    start-dev)
        start_dev
        ;;
    stop)
        stop_services
        ;;
    restart)
        restart_services
        ;;
    logs)
        show_logs
        ;;
    logs-backend)
        show_backend_logs
        ;;
    logs-frontend)
        show_frontend_logs
        ;;
    build)
        build_images
        ;;
    build-backend)
        build_backend
        ;;
    build-frontend)
        build_frontend
        ;;
    clean)
        clean_up
        ;;
    status)
        show_status
        ;;
    shell-backend)
        shell_backend
        ;;
    shell-frontend)
        shell_frontend
        ;;
    shell-db)
        shell_db
        ;;
    backup-db)
        backup_db
        ;;
    restore-db)
        restore_db "$2"
        ;;
    help|--help|-h)
        show_usage
        ;;
    *)
        print_error "Unknown command: $1"
        show_usage
        exit 1
        ;;
esac
