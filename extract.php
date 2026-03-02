<?php
/**
 * G-Nexus Deployment Extractor
 * This script is uploaded by GitHub Actions and auto-deletes after use.
 * It must NOT be left on the server after deployment.
 */

// Security: require a secret token in the request
$secret = getenv('DEPLOY_SECRET') ?: 'gnexus-deploy-2026';
if (!isset($_GET['token']) || $_GET['token'] !== $secret) {
    http_response_code(403);
    die(json_encode(['status' => 'error', 'message' => 'Unauthorized']));
}

$zipFile = __DIR__ . '/deploy.zip';
$extractTo = __DIR__ . '/';

if (!file_exists($zipFile)) {
    http_response_code(404);
    die(json_encode(['status' => 'error', 'message' => 'deploy.zip not found']));
}

$zip = new ZipArchive();
$opened = $zip->open($zipFile);

if ($opened !== TRUE) {
    http_response_code(500);
    die(json_encode(['status' => 'error', 'message' => 'Failed to open zip: ' . $opened]));
}

$extracted = $zip->extractTo($extractTo);
$zip->close();

// Self-delete the zip and this script after extraction
@unlink($zipFile);
@unlink(__FILE__);

if ($extracted) {
    http_response_code(200);
    echo json_encode(['status' => 'success', 'message' => 'Deployment complete! Files extracted.']);
} else {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Extraction failed']);
}
