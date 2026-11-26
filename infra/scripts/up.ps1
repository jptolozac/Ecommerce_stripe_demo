# Uso: .\infra\scripts\up.ps1
# Levanta la base (si no existe) y la app con la imagen más reciente de ECR.
param(
  [string]$AwsProfile = "personal",
  [string]$DbUser = "bibliotecario"
)

$plantillas = Join-Path $PSScriptRoot "..\cloudformation"

function Existe($stack) {
  aws cloudformation describe-stacks --stack-name $stack --profile $AwsProfile 2>$null | Out-Null
  return $LASTEXITCODE -eq 0
}

function Fallo($mensaje) { Write-Host $mensaje; exit 1 }

# 1. Etiqueta más reciente: la última imagen que subió el pipeline
$tag = aws ecr describe-images --repository-name lab-cicd/backend --profile $AwsProfile `
  --query "sort_by(imageDetails,&imagePushedAt)[-1].imageTags[0]" --output text
if ($LASTEXITCODE -ne 0 -or -not $tag -or $tag -eq "None") { Fallo "No encontré imágenes en ECR" }
Write-Host "Imagen: $tag"

# 2. Clave de la base (no se muestra al escribirla)
$segura = Read-Host "Clave de la base de datos" -AsSecureString
$dbPassword = [System.Net.NetworkCredential]::new("", $segura).Password

# 3. Base de datos, solo si no existe
if (-not (Existe "lab-db")) {
  Write-Host "Creando lab-db (unos 10 minutos)..."
  aws cloudformation deploy --stack-name lab-db --profile $AwsProfile `
    --template-file (Join-Path $plantillas "04-db.yaml") `
    --parameter-overrides DbUser=$DbUser DbPassword=$dbPassword
  if ($LASTEXITCODE -ne 0) { Fallo "Falló lab-db, revisa la consola" }
}

# 4. App con esa etiqueta. El JWT se genera en cada subida: solo cierra sesiones viejas
$jwt = [guid]::NewGuid().ToString("N") + [guid]::NewGuid().ToString("N")
Write-Host "Desplegando lab-app..."
aws cloudformation deploy --stack-name lab-app --profile $AwsProfile `
  --template-file (Join-Path $plantillas "05-ecs.yaml") `
  --capabilities CAPABILITY_NAMED_IAM --no-fail-on-empty-changeset `
  --parameter-overrides ImageTag=$tag DbUser=$DbUser DbPassword=$dbPassword JwtSecret=$jwt
if ($LASTEXITCODE -ne 0) { Fallo "Falló lab-app, revisa la consola" }

$url = aws cloudformation describe-stacks --stack-name lab-app --profile $AwsProfile `
  --query "Stacks[0].Outputs[?OutputKey=='Url'].OutputValue" --output text
Write-Host "Listo: $url"