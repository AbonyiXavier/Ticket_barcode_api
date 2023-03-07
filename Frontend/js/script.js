
const scanner = new Html5QrcodeScanner('reader', {
    qrbox: {
      width: 250,
      height: 250,
    },
    fps: 20,
  });
  scanner.render(success, error);
  
  function success(result) {
    fetch(`http://localhost:8001/api/v1/validate/qr/?unique_qr_code=${result}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
            document.getElementById('result').innerHTML = `
            <div id="container">
            <p>${data.message}</p>
            <img src="${data.data.barcode_image}" alt="QR_IMAGE" />
            </div>
            `;
          }
          scanner.clear();
          document.getElementById('reader').remove();
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
  function error(err) {
    console.error(err);
  }