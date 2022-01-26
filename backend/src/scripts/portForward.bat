echo off
set service=%1
set portFrom=%2
set portTo=%3
set namespace=%4

kubectl port-forward --pod-running-timeout=30s services/%service% %portFrom%:%portTo% --namespace=%namespace% 