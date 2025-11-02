#!/bin/bash

# Spring Boot Todo App - Docker Management Script
# Usage: ./docker.sh [command]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="spring-boot-todo"
COMPOSE_FILE="docker-compose.yml"
COMPOSE_FILE_PROD="docker-compose.prod.yml"

# Helper functions
print_help() {
    echo -e "${BLUE}Spring Boot Todo App - Docker Management${NC}"
    echo ""
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  build         Build all Docker images"
    echo "  up            Start all services (development mode)"
    echo "  up-prod       Start all services (production mode)"
    echo "  down          Stop all services"
    echo "  restart       Restart all services"
    echo "  logs          Show logs from all services"
    echo "  logs-f        Follow logs from all services"
    echo "  status        Show status of all services"
    echo "  clean         Remove containers, networks, and volumes"
    echo "  clean-all     Remove everything including images"
    echo "  db-shell      Connect to PostgreSQL shell"
    echo "  backend-shell Connect to backend container shell"
    echo "  frontend-shell Connect to frontend container shell"
    echo "  test          Run backend tests"
    echo "  help          Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 build && $0 up"
    echo "  $0 logs-f backend"
    echo "  $0 up-prod"
}

print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}!${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed or not in PATH"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        print_error "Docker Compose is not installed"
        exit 1
    fi
}

# Get docker-compose command (handles both docker-compose and docker compose)
get_compose_cmd() {
    if command -v docker-compose &> /dev/null; then
        echo "docker-compose"
    else
        echo "docker compose"
    fi
}

build_images() {
    print_info "Building Docker images..."
    COMPOSE_CMD=$(get_compose_cmd)
    $COMPOSE_CMD -f $COMPOSE_FILE build --no-cache
    print_status "Images built successfully"
}

start_services() {
    local compose_file=$1
    local mode=$2
    
    print_info "Starting services in $mode mode..."
    COMPOSE_CMD=$(get_compose_cmd)
    
    # Create .env file from example if it doesn't exist
    if [ "$mode" = "production" ]; then
        if [ ! -f .env.prod ]; then
            print_warning ".env.prod not found, creating from example"
            cp .env.prod.example .env.prod
            print_warning "Please edit .env.prod with your production settings"
        fi
        $COMPOSE_CMD -f $compose_file --env-file .env.prod up -d
    else
        if [ ! -f .env ]; then
            print_warning ".env not found, creating from example"
            cp .env.example .env
        fi
        $COMPOSE_CMD -f $compose_file up -d
    fi
    
    print_status "Services started successfully"
    print_info "Frontend: http://localhost:${FRONTEND_PORT:-3000}"
    print_info "Backend API: http://localhost:8080"
    print_info "Backend Health: http://localhost:8080/actuator/health"
}

stop_services() {
    print_info "Stopping services..."
    COMPOSE_CMD=$(get_compose_cmd)
    $COMPOSE_CMD -f $COMPOSE_FILE down
    $COMPOSE_CMD -f $COMPOSE_FILE_PROD down 2>/dev/null || true
    print_status "Services stopped"
}

restart_services() {
    stop_services
    start_services $COMPOSE_FILE "development"
}

show_logs() {
    local follow=$1
    local service=$2
    COMPOSE_CMD=$(get_compose_cmd)
    
    if [ "$follow" = "true" ]; then
        if [ -n "$service" ]; then
            $COMPOSE_CMD -f $COMPOSE_FILE logs -f "$service"
        else
            $COMPOSE_CMD -f $COMPOSE_FILE logs -f
        fi
    else
        if [ -n "$service" ]; then
            $COMPOSE_CMD -f $COMPOSE_FILE logs "$service"
        else
            $COMPOSE_CMD -f $COMPOSE_FILE logs
        fi
    fi
}

show_status() {
    print_info "Service Status:"
    COMPOSE_CMD=$(get_compose_cmd)
    $COMPOSE_CMD -f $COMPOSE_FILE ps
}

clean_containers() {
    print_info "Cleaning up containers, networks, and volumes..."
    COMPOSE_CMD=$(get_compose_cmd)
    $COMPOSE_CMD -f $COMPOSE_FILE down -v --remove-orphans
    $COMPOSE_CMD -f $COMPOSE_FILE_PROD down -v --remove-orphans 2>/dev/null || true
    print_status "Cleanup completed"
}

clean_all() {
    print_warning "This will remove all containers, networks, volumes, and images"
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        clean_containers
        print_info "Removing images..."
        docker images --filter "reference=${PROJECT_NAME}*" -q | xargs -r docker rmi -f
        print_status "All resources cleaned"
    else
        print_info "Cancelled"
    fi
}

connect_db_shell() {
    print_info "Connecting to PostgreSQL shell..."
    COMPOSE_CMD=$(get_compose_cmd)
    $COMPOSE_CMD -f $COMPOSE_FILE exec database psql -U todouser -d todoapp
}

connect_backend_shell() {
    print_info "Connecting to backend container..."
    COMPOSE_CMD=$(get_compose_cmd)
    $COMPOSE_CMD -f $COMPOSE_FILE exec backend sh
}

connect_frontend_shell() {
    print_info "Connecting to frontend container..."
    COMPOSE_CMD=$(get_compose_cmd)
    $COMPOSE_CMD -f $COMPOSE_FILE exec frontend sh
}

run_tests() {
    print_info "Running backend tests..."
    COMPOSE_CMD=$(get_compose_cmd)
    $COMPOSE_CMD -f $COMPOSE_FILE exec backend ./mvnw test
}

# Main script
main() {
    check_docker
    
    case "${1:-help}" in
        "build")
            build_images
            ;;
        "up")
            start_services $COMPOSE_FILE "development"
            ;;
        "up-prod")
            start_services $COMPOSE_FILE_PROD "production"
            ;;
        "down")
            stop_services
            ;;
        "restart")
            restart_services
            ;;
        "logs")
            show_logs false "$2"
            ;;
        "logs-f")
            show_logs true "$2"
            ;;
        "status")
            show_status
            ;;
        "clean")
            clean_containers
            ;;
        "clean-all")
            clean_all
            ;;
        "db-shell")
            connect_db_shell
            ;;
        "backend-shell")
            connect_backend_shell
            ;;
        "frontend-shell")
            connect_frontend_shell
            ;;
        "test")
            run_tests
            ;;
        "help"|*)
            print_help
            ;;
    esac
}

# Run main function with all arguments
main "$@"