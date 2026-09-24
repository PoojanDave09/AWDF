# ============================================================
# Test Script for Task Manager API
# Run: powershell -ExecutionPolicy Bypass -File test-api.ps1
# ============================================================

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  Testing Task Manager API Endpoints" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# ------ TEST 1: GET /tasks - Get all tasks ------
Write-Host "TEST 1: GET /tasks (Get all tasks)" -ForegroundColor Yellow
Write-Host "Expected Status: 200 OK" -ForegroundColor Gray
try {
    $response = Invoke-RestMethod -Uri 'http://localhost:5000/tasks' -Method GET
    Write-Host "SUCCESS: Found $($response.count) tasks" -ForegroundColor Green
    $response.data | ForEach-Object { Write-Host "  - [$($_.id)] $($_.title) (Completed: $($_.completed))" }
} catch {
    Write-Host "FAILED: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n----------------------------------------`n"

# ------ TEST 2: GET /tasks/1 - Get single task ------
Write-Host "TEST 2: GET /tasks/1 (Get single task)" -ForegroundColor Yellow
Write-Host "Expected Status: 200 OK" -ForegroundColor Gray
try {
    $response = Invoke-RestMethod -Uri 'http://localhost:5000/tasks/1' -Method GET
    Write-Host "SUCCESS: Found task - $($response.data.title)" -ForegroundColor Green
} catch {
    Write-Host "FAILED: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n----------------------------------------`n"

# ------ TEST 3: POST /tasks - Create a new task ------
Write-Host "TEST 3: POST /tasks (Create new task)" -ForegroundColor Yellow
Write-Host "Expected Status: 201 Created" -ForegroundColor Gray
try {
    $body = @{
        title = "Complete Practical 4 Report"
        description = "Write the practical report and submit"
        completed = $false
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri 'http://localhost:5000/tasks' -Method POST -ContentType 'application/json' -Body $body
    Write-Host "SUCCESS: Created task with ID $($response.data.id) - $($response.data.title)" -ForegroundColor Green
} catch {
    Write-Host "FAILED: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n----------------------------------------`n"

# ------ TEST 4: PUT /tasks/1 - Update a task ------
Write-Host "TEST 4: PUT /tasks/1 (Update task)" -ForegroundColor Yellow
Write-Host "Expected Status: 200 OK" -ForegroundColor Gray
try {
    $body = @{
        title = "Learn Node.js (COMPLETED)"
        completed = $true
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri 'http://localhost:5000/tasks/1' -Method PUT -ContentType 'application/json' -Body $body
    Write-Host "SUCCESS: Updated task - $($response.data.title) (Completed: $($response.data.completed))" -ForegroundColor Green
} catch {
    Write-Host "FAILED: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n----------------------------------------`n"

# ------ TEST 5: DELETE /tasks/3 - Delete a task ------
Write-Host "TEST 5: DELETE /tasks/3 (Delete task)" -ForegroundColor Yellow
Write-Host "Expected Status: 200 OK" -ForegroundColor Gray
try {
    $response = Invoke-RestMethod -Uri 'http://localhost:5000/tasks/3' -Method DELETE
    Write-Host "SUCCESS: Deleted task - $($response.data.title)" -ForegroundColor Green
} catch {
    Write-Host "FAILED: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n----------------------------------------`n"

# ------ TEST 6: GET /tasks/999 - Not Found ------
Write-Host "TEST 6: GET /tasks/999 (Task not found)" -ForegroundColor Yellow
Write-Host "Expected Status: 404 Not Found" -ForegroundColor Gray
try {
    $response = Invoke-RestMethod -Uri 'http://localhost:5000/tasks/999' -Method GET
    Write-Host "UNEXPECTED SUCCESS (should have been 404)" -ForegroundColor Red
} catch {
    Write-Host "SUCCESS: Got expected 404 error" -ForegroundColor Green
    Write-Host "  Response: $($_.Exception.Message)" -ForegroundColor Gray
}

Write-Host "`n----------------------------------------`n"

# ------ TEST 7: GET /tasks/abc - Invalid ID ------
Write-Host "TEST 7: GET /tasks/abc (Invalid task ID format)" -ForegroundColor Yellow
Write-Host "Expected Status: 400 Bad Request" -ForegroundColor Gray
try {
    $response = Invoke-RestMethod -Uri 'http://localhost:5000/tasks/abc' -Method GET
    Write-Host "UNEXPECTED SUCCESS (should have been 400)" -ForegroundColor Red
} catch {
    Write-Host "SUCCESS: Got expected 400 error - Invalid ID rejected" -ForegroundColor Green
    Write-Host "  Response: $($_.Exception.Message)" -ForegroundColor Gray
}

Write-Host "`n----------------------------------------`n"

# ------ TEST 8: GET /unknown - Undefined Route ------
Write-Host "TEST 8: GET /unknown (Undefined route)" -ForegroundColor Yellow
Write-Host "Expected Status: 404 Not Found" -ForegroundColor Gray
try {
    $response = Invoke-RestMethod -Uri 'http://localhost:5000/unknown' -Method GET
    Write-Host "UNEXPECTED SUCCESS (should have been 404)" -ForegroundColor Red
} catch {
    Write-Host "SUCCESS: Got expected 404 for undefined route" -ForegroundColor Green
    Write-Host "  Response: $($_.Exception.Message)" -ForegroundColor Gray
}

Write-Host "`n----------------------------------------`n"

# ------ TEST 9: Verify final state ------
Write-Host "TEST 9: GET /tasks (Verify final state after all operations)" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri 'http://localhost:5000/tasks' -Method GET
    Write-Host "SUCCESS: $($response.count) tasks remaining" -ForegroundColor Green
    $response.data | ForEach-Object { Write-Host "  - [$($_.id)] $($_.title) (Completed: $($_.completed))" }
} catch {
    Write-Host "FAILED: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  All Tests Complete!" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan
