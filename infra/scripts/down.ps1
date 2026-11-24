# Solo funciona para windows
# Uso:
#   .\infra\scripts\down.ps1        -> borra solo la app (lab-app)
#   .\infra\scripts\down.ps1 -Db    -> borra la app y la base (lab-db)
param(
  [switch]$Db,
  [string]$AwsProfile = "personal"
)

function Borrar($stack) {
  aws cloudformation describe-stacks --stack-name $stack --profile $AwsProfile 2>$null | Out-Null
  if ($LASTEXITCODE -ne 0) { Write-Host "$stack no existe, nada que borrar"; return }

  Write-Host "Borrando $stack..."
  aws cloudformation delete-stack --stack-name $stack --profile $AwsProfile
  aws cloudformation wait stack-delete-complete --stack-name $stack --profile $AwsProfile
  if ($LASTEXITCODE -ne 0) { Write-Host "Revisa $stack en la consola, el borrado no terminó bien"; exit 1 }
  Write-Host "$stack borrado"
}

Borrar "lab-app"   # primero la app, porque importa el endpoint de la base
if ($Db) { Borrar "lab-db" }