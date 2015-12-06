function sumbitFrom() {
    var flag = document.getElementById('flag');
    if (flag.value != '0') {
        return true;
    } else {
        alert('请选择图片.');
    }
}

function chooseFile(id) {
    document.getElementById(id).click();
}

function changBackground(files, id, width, height) {
    if (files.files && files.files.length) {
        var reader = new FileReader();
        reader.onload = function(evt) {
            document.getElementById('flag').value = '1';
            document.getElementById(id).width = width;
            document.getElementById(id).height = height;
            document.getElementById(id).src = evt.target.result;
        }
        reader.readAsDataURL(files.files[0]);
    }
}

function searchAnnouncements(page) {
    alert(page);
}