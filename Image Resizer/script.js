function resizeAndCompressImage() {
    const fileInput = document.getElementById('fileInput');
    const targetSize = parseInt(document.getElementById('targetSize').value) * 1024; 
    const quality = parseFloat(document.getElementById('quality').value);
    const outputImage = document.getElementById('outputImage');
    const downloadLink = document.getElementById('downloadLink');
    const canvas = document.getElementById('canvas');

    if (!fileInput.files[0] || !targetSize) {
        alert('Please select an image and enter a target size.');
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        const img = new Image();
        img.src = e.target.result;

        img.onload = function () {
            const ctx = canvas.getContext('2d', { alpha: false });
            const maxDimension = 1024; 
            const scaleFactor = Math.min(1, maxDimension / Math.max(img.width, img.height));
            const newWidth = img.width * scaleFactor;
            const newHeight = img.height * scaleFactor;

            canvas.width = newWidth;
            canvas.height = newHeight;

            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, 0, 0, newWidth, newHeight);

            let resizedDataUrl;
            let currentQuality = quality;

            while (true) {
                resizedDataUrl = canvas.toDataURL('image/jpeg', currentQuality);
                const dataSize = atob(resizedDataUrl.split(',')[1]).length;

                if (dataSize <= targetSize || currentQuality <= 0.1) {
                    break;
                }

                currentQuality -= 0.05; 
            }

            outputImage.src = resizedDataUrl;
            downloadLink.href = resizedDataUrl;
            downloadLink.style.display = 'inline-block';

            const finalSizeKB = Math.round(atob(resizedDataUrl.split(',')[1]).length / 1024);
            alert(`Image resized to approximately ${finalSizeKB} KB at quality ${currentQuality.toFixed(2)}.`);
        };
    };

    reader.readAsDataURL(file);
}
