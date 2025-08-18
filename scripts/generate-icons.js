const sharp = require('sharp');
const fs = require('fs');

async function generateIcons() {
  try {
    // 192x192 PNG生成
    await sharp('public/icon-192x192.svg')
      .png()
      .resize(192, 192)
      .toFile('public/icon-192x192.png');
    
    console.log('✅ icon-192x192.png generated');

    // 512x512 PNG生成
    await sharp('public/icon-512x512.svg')
      .png()
      .resize(512, 512)
      .toFile('public/icon-512x512.png');
    
    console.log('✅ icon-512x512.png generated');

    // favicon.ico生成 (32x32)
    await sharp('public/icon-192x192.svg')
      .png()
      .resize(32, 32)
      .toFile('public/favicon.ico');
    
    console.log('✅ favicon.ico generated');

    // Apple Touch Icon生成 (180x180)
    await sharp('public/icon-192x192.svg')
      .png()
      .resize(180, 180)
      .toFile('public/apple-touch-icon.png');
    
    console.log('✅ apple-touch-icon.png generated');

    console.log('🎉 All icons generated successfully!');
  } catch (error) {
    console.error('❌ Error generating icons:', error);
  }
}

generateIcons();
