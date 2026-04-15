const sharp = require('sharp');
const path = require('path');

async function processImage() {
  try {
    // Obtener metadata de la imagen base
    const metadata = await sharp(path.join(__dirname, '../public/images/fondo.png')).metadata();
    console.log('Dimensiones originales:', metadata.width, 'x', metadata.height);

    // Recortar verticalmente: desde el logo 'MonteVerde' hasta debajo de los botones
    // Asumiendo top=250, height=400 (ajustar según necesidad)
    const top = 250;
    const height = 400;
    await sharp(path.join(__dirname, '../public/images/fondo.png'))
      .extract({ left: 0, top: top, width: metadata.width, height: height })
      .png()
      .toFile(path.join(__dirname, '../public/images/fondo-cropped.png'));
    console.log('Imagen recortada guardada como public/images/fondo-cropped.png');

    // Colorizar el logo de Bolívar a verde oscuro
    const logoWidth = Math.round(metadata.width * 0.1); // 10% del ancho
    await sharp(path.join(__dirname, '../public/images/seguros-bolivar-logo.png'))
      .tint({ r: 0, g: 80, b: 0 }) // verde oscuro
      .resize(logoWidth)
      .png()
      .toFile(path.join(__dirname, '../public/images/logo-verde.png'));
    console.log('Logo colorizado guardado como public/images/logo-verde.png');

    // Superponer el logo en la esquina superior izquierda, alineado con el texto 'Respaldo'
    // Asumiendo top=50 para alineación con el texto
    await sharp(path.join(__dirname, '../public/images/fondo-cropped.png'))
      .composite([{ input: path.join(__dirname, '../public/images/logo-verde.png'), top: 50, left: 10 }])
      .png()
      .toFile(path.join(__dirname, '../public/images/fondo-final.png'));
    console.log('Imagen final con logo superpuesto guardada como public/images/fondo-final.png');

  } catch (err) {
    console.error('Error:', err);
  }
}

processImage();