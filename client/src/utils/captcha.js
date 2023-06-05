
export const generateCaptcha = (numLetters=5) => {
    const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lenChars = chars.length;
    let captcha = '';
    for (let i=0; i<numLetters; i++){
        let index = Math.floor(Math.random() * lenChars);
        let char = chars[index];
        captcha += char;
    }
    return captcha;
}

export const generateCanvasFromCaptcha = (captcha) => {
    let container = document.getElementById('captcha-canvas');
    if(container){
        container.innerHTML = '';

        let canvas = document.createElement('CANVAS');
        let width = 20 * captcha.length;
        canvas.id='captcha';
        canvas.width = width;
        canvas.height = 50;

        let ctx = canvas.getContext('2d');
        ctx.font = '25px Georgia';
        ctx.textAlign = 'center';
        ctx.strokeStyle = '#fff';
        ctx.strokeText(captcha, width/2, 30);

        container.appendChild(canvas);
    }
}