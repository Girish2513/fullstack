#!/bin/bash
set -e
BASE="http://localhost:3000"

echo "=== Creating users ==="
curl -s -X POST $BASE/users -H "Content-Type: application/json" -d '{"name":"Girish","email":"girish@example.com"}'
echo
curl -s -X POST $BASE/users -H "Content-Type: application/json" -d '{"name":"Revanth","email":"revanth@example.com"}'
echo

echo "=== Setting preferences ==="
curl -s -X PUT $BASE/users/1/preferences -H "Content-Type: application/json" -d '{"settings":{"theme":"dark","language":"en"}}'
echo

echo "=== Creating project ==="
curl -s -X POST $BASE/projects -H "Content-Type: application/json" -d '{"name":"Task App","description":"Main project","ownerId":1}'
echo

echo "=== Creating tasks ==="
curl -s -X POST $BASE/tasks -H "Content-Type: application/json" -d '{"title":"Build API","userId":1,"projectId":1,"metadata":{"priority":"high"}}'
echo
curl -s -X POST $BASE/tasks -H "Content-Type: application/json" -d '{"title":"Write tests","userId":2,"projectId":1}'
echo

echo "=== Adding tags ==="
curl -s -X POST $BASE/tasks/1/tags -H "Content-Type: application/json" -d '{"tag":"urgent"}'
echo
curl -s -X POST $BASE/tasks/1/tags -H "Content-Type: application/json" -d '{"tag":"backend"}'
echo

echo "=== Adding comments ==="
curl -s -X POST $BASE/tasks/1/comments -H "Content-Type: application/json" -d '{"body":"Looks great","authorId":2}'
echo
curl -s -X POST $BASE/tasks/1/comments -H "Content-Type: application/json" -d '{"body":"Thanks will fix it","authorId":1,"parentId":1}'
echo

echo "=== Task with details ==="
curl -s $BASE/tasks/1
echo

echo "=== Threaded comments ==="
curl -s $BASE/tasks/1/comments/threaded
echo

echo "=== Project with task_count ==="
curl -s $BASE/projects/1
echo

echo "=== Search by metadata ==="
curl -s "$BASE/tasks/search?key=priority&value=high"
echo

echo "=== User preferences ==="
curl -s $BASE/users/1/preferences
echo
