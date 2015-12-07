function sumbitFromNew() {
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

function previewModel(id) {
    var form = {
        dataType: 'json',
        type:'post',
        cache: false,
        timeout: 5000,
        success: function(data){
            document.getElementById('m-content').innerHTML = data.html;
            $("#myModal").modal();
        },
        error: function(jqXHR, textStatus, errorThrown){
            console.log('error ' + textStatus + " " + errorThrown);
        }
    }
    if (document.getElementById(id)) {
        form.url = '/main/preview-announcements/';
        form.data = {content : document.getElementById(id).value};
    } else {
        form.url = '/main/preview-announcements/' + id;
    }

    $.ajax(form);
}