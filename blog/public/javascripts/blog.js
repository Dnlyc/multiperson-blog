function submitReply(id) {
    $('#comments_id').val(id);
    $("#myModal").modal();
}

function removePhoto (path) {

    document.getElementById("path").value = path;
     document.getElementById("albums-post").submit();

    //if(parseInt(document.getElementById("photo-old-length").value) > id) {
    //    var remove_input = document.createElement('input');
    //    remove_input.type = 'text';
    //    remove_input.name = 'remove[]';
    //    remove_input.style.display = '';
    //    var src = document.getElementById('photo' + id.toString()).src;
    //    remove_input.value = src.substring(src.lastIndexOf('/') + 1, src.length);
    //    document.getElementById('form').appendChild(remove_input);
    //}
    //$('#photo-' + id).remove();
}

function createAlbums() {
    $("#myModal").modal();
}

function addPhoto () {
    document.getElementById('multiple-file').click();
}

function onChangeFile (files) {
    if (files.files && files.files.length) {
        document.getElementById("albums-post").submit();
    }
}

/**
 * 加载本地图片
 * @param files
 * @param index
 * @param num
 * @param progress
 */
function addFile (files, index, num, progress) {
    var id = index + num;
    var grid_div = document.createElement('div');
    grid_div.className = "col-md-3 gallery-grids";
    grid_div.id = "photo-" + id.toString();

    var grid_a = document.createElement("a");
    grid_a.className = "b-link-stripe b-animate-go swipebox";

    var image = document.createElement("img");
    image.style.height = '160px';
    image.style.width = '260px';
    image.href = '#';

    var wrapper_div = document.createElement('div');
    wrapper_div.className = "b-wrapper";
    var span = document.createElement('span');
    span.className = "b-animate b-from-left b-delay03";

    var wrapper_image = document.createElement("img");
    wrapper_image.className = "img-responsive zoom-img img-circle";
    wrapper_image.src = "/images/e.png";

    var remove_div = document.createElement('div');
    remove_div.align = "center";
    remove_div.style.paddingTop = "1em";
    var remove_button = document.createElement('button');
    remove_button.className = "btn btn-danger";
    remove_button.innerHTML = "移除";
    remove_button.addEventListener("click", function () {removePhoto(id)}, false);
    remove_div.appendChild(remove_button);

    grid_a.appendChild(image);
    grid_a.appendChild(wrapper_div);
    wrapper_div.appendChild(span);
    span.appendChild(wrapper_image);

    grid_div.appendChild(grid_a);
    grid_div.appendChild(remove_div);

    var reader = new FileReader();
    reader.onload = function(evt){
        grid_a.href = evt.target.result;
        image.src = evt.target.result;
        var add =  document.getElementById('add');
        add.parentNode.insertBefore(grid_div, add);

        // 改变模态框读取信息
        progress = parseInt(100 / files.length * ++index);
        document.getElementById('progress').style.width = progress.toString() + '%';
        document.getElementById('progress-text').innerText = '文件加载进度已完成' + progress.toString() + '%';
        if (progress == 100) {
            document.getElementById('button-close').style.display = '';
        }

        index < files.length ? addFile(files, index, progress) : false;
    };
    reader.readAsDataURL(files[index]);
}

function closeModal() {
    $('#myModal').modal("hide");
    setTimeout(function () {
        document.getElementById('button-close').style.display = 'none';
        document.getElementById('progress').style.width = '0%';
        document.getElementById('progress-text').innerText = '文件加载进度已完成0%';
    }, 500)
}

function preview() {
    window.open("/");
}

function chooseAvater() {
    document.getElementById('avater').click();
}

function changAvater(files) {
    if (files.files && files.files.length) {
        var reader = new FileReader();
        reader.onload = function(evt) {
            alert('finish');
            document.getElementById('i-avater').src = evt.target.result;
        }
        reader.readAsDataURL(files.files[0]);
    }
}

function changeValue(input) {
}

function postPreview() {
    var params ={
        content: $("#content").val()
    };

    $.ajax({
        data: params,
        url: '/preview',
        dataType: 'json',
        type:'post',
        cache: false,
        timeout: 5000,
        success: function(data){
            alert(data.html);
            console.log(data.html);
            document.getElementById('m-content').innerHTML = data.html.html;
            $("#myModal").modal();
        },
        error: function(jqXHR, textStatus, errorThrown){
            alert('error ' + textStatus + " " + errorThrown);
        }
    });
}

function OnInput (button, content) {
    document.getElementById(button).innerHTML = document.getElementById(content).value;
}

function changeText(button, content) {
    if (document.getElementById(content).value === "") {
        alert('标签内容不能为空！');
        document.getElementById(content).value = "default";
        document.getElementById(button).innerHTML = "default";
    }
}

function selectStyle(button, style) {
    document.getElementById(button).className = "btn " + document.getElementById(style).value;
}

function changeTag(id) {
    var button = document.getElementById(id);
    document.getElementById('module-content').value = button.innerHTML;
    var options = document.getElementById('module-style').options;


    document.getElementById('module-button').innerHTML = button.innerHTML;
    document.getElementById('module-button').className = button.className;

    for (var i = 0; i < options.length; i++) {
        if ('btn ' + options[i].value === button.className) {
            options[i].selected = true;
            break;
        }
    }
    //switch (button.className) {
    //    case "btn btn-default" :  $("#module-style  option[value='btn btn-default'] ").attr("selected",true); break;
    //    case "btn btn-primary" :  $("#module-style  option[value='btn btn-primary'] ").attr("selected",true); break;
    //    case "btn btn-success" :  $("#module-style  option[value='btn btn-success'] ").attr("selected",true); break;
    //    case "btn btn-info" :  $("#module-style  option[value='btn btn-info'] ").attr("selected",true); break;
    //    case "btn btn-warning" :  $("#module-style  option[value='btn btn-warning'] ").attr("selected",true); break;
    //    case "btn btn-danger" :  $("#module-style  option[value='btn btn-danger'] ").attr("selected",true); break;
    //}
    $("#myModal").modal();
}