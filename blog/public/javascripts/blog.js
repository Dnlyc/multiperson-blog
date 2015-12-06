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

function chooseFile(id) {
    document.getElementById(id).click();
}

function changBackground(files, id, width, height) {
    if (files.files && files.files.length) {
        var reader = new FileReader();
        reader.onload = function(evt) {
            if (width !== 0) {
                document.getElementById(id).width = width;
            }
            if (height !== 0) {
                document.getElementById(id).height = height;
            }
            document.getElementById(id).src = evt.target.result;
        }
        reader.readAsDataURL(files.files[0]);
    }
}

function changeValue(input) {
}

function postPreview() {

    if ($("#content").val() === '') {
        alert('正文请输入内容！');
        return ;
    }

    $.ajax({
        data: {content: $("#content").val()},
        url: '/preview',
        dataType: 'json',
        type:'post',
        cache: false,
        timeout: 5000,
        success: function(data){
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
    document.getElementById('id-module').value = id;

    for (var i = 0; i < options.length; i++) {
        if ('btn ' + options[i].value === button.className) {
            options[i].selected = true;
            break;
        }
    }
    $("#myModal").modal();
}

function updateTag(name) {
    var params ={
        id: document.getElementById('id-module').value,
        content : document.getElementById('module-content').value,
        style : document.getElementById('module-style').value
    };
    $.ajax({
        data: params,
        url: '/space/' + name + '/tags/update',
        dataType: 'json',
        type:'post',
        cache: false,
        timeout: 5000,
        success: function(data){
            if (data.success) {
                window.location.href = '/space/' + name + '/tags';
            }
        },
        error: function(jqXHR, textStatus, errorThrown){
            alert('error ' + textStatus + " " + errorThrown);
        }
    });
}

function removeTag(name) {
    $.ajax({
        data: {id: document.getElementById('id-module').value},
        url: '/space/' + name + '/tags/remove',
        dataType: 'json',
        type:'post',
        cache: false,
        timeout: 5000,
        success: function(data){
            if (data.success) {
                window.location.href = '/space/' + name + '/tags';
            }
        },
        error: function(jqXHR, textStatus, errorThrown){
            alert('error ' + textStatus + " " + errorThrown);
        }
    });
}

function selectTag(id) {
    var con = document.getElementById('tags'+id);
    if (con === null) {
        var select_button = document.getElementById(id);
        var button = document.createElement("button");
        button.className = select_button.className;
        button.id = 'tags'+id;
        button.innerHTML = select_button.innerHTML;
        button.style.marginTop = '1em';
        //button.style.marginLeft = '1em';
        button.disabled = "disabled";
        document.getElementById('blog-tags').appendChild(button);

        var input = document.createElement("input");
        input.type = 'text';
        input.value = id;
        input.id = 'id' + id;
        input.name = 'tag';
        input.style.display = 'none';
        document.getElementById('submit-id').appendChild(input);
    } else {
        document.getElementById('blog-tags').removeChild(con);
        document.getElementById('submit-id').removeChild(document.getElementById('id' + id));
    }
}

function removePost (name, time, title) {
    window.location.href="/space/posts/" + name + "/" + time + "/" + title + "/remove"
}

function gotoRegister() {
    window.location.href="/register"
}

function openImage (address) {
    window.open(address);
}

function searchPostsOrAlbums (page) {
    $.ajax({
        data: {
            content: document.getElementById('content').value,
            type: document.getElementById('type').value,
            method: true
        },
        url: '/search/' + page,
        dataType: 'json',
        type:'post',
        cache: false,
        timeout: 5000,
        success: function(data){
            if (document.getElementById('type').value !== '2') {
                resetPosts(data);
            } else {
                resetAlbums (data);
            }
        },
        error: function(jqXHR, textStatus, errorThrown){
            console.log('error ' + textStatus + " " + errorThrown);
        }
    });
}

function resetPosts(data) {
    $('#mainbar').empty();
    if (data.posts.length == 0) {
        var br = document.createElement("br");
        var p = document.createElement("p");
        p.style.paddingLeft = '4em';
        p.innerHTML = "没有类似相关的内容"
        $('#mainbar').append(br);
        $('#mainbar').append(p);
    } else {
        data.posts.forEach(function (post) {
            // 文章内容更新
            var article = document.createElement("div");
            article.className = "article";

            var h2 = document.createElement("h2");
            var h2_span = document.createElement("span");
            h2_span.innerHTML = post.title;
            h2.appendChild(h2_span);

            var clr = document.createElement("div");
            clr.className = "clr";

            var p = document.createElement("p");
            var name = document.createElement("a");
            name.href = "/space/" + post.name;
            var name = document.createElement("a");
            name.href = "/space/" + post.name;
            name.innerHTML = post.name;
            p.innerHTML = "博主:";
            p.appendChild(name);
            p.innerHTML += ',日期:' + post.time.day + ',浏览次数:' + post.pv + ',评论:' + post.c_num;

            var p_post = document.createElement("p");
            p_post.innerHTML = post.post.html;

            var read = document.createElement("p");
            var a_read = document.createElement("a");
            a_read.href = "/space/blog/" + post.name + '/' + post.time.day + '/' + post.title;
            a_read.innerHTML = '阅读全文';
            read.appendChild(a_read);

            article.appendChild(h2);
            article.appendChild(clr);
            article.appendChild(p);
            article.appendChild(clr);
            article.appendChild(p_post);
            article.appendChild(read);

            $('#mainbar').append(article);
        })

        resetPages('mainbar', data);
    }
}

function resetAlbums(data) {
    $('#container').empty();

    var h1 = document.createElement("h1");
    h1.innerHTML = '精彩相册';

    var row = document.createElement("div");
    row.className = 'row';
    var col = document.createElement("div");
    col.className = 'col-lg-12';
    var panel = document.createElement("div");
    panel.className = "panel panel-default";

    var panel_heading = document.createElement("div");
    panel_heading.className = "panel-heading";
    var text_muted = document.createElement("div");
    text_muted.className = "text-muted bootstrap-admin-box-title";
    text_muted.innerHTML = "&nbsp;";
    panel_heading.appendChild(text_muted);


    var panel_content = document.createElement("div");
    panel_content.className = "bootstrap-admin-panel-content";
    for(var i = 0; i < data.albums.length; i++) {
        if (i % 3 == 0) {
            var row_bootstrap = document.createElement("div");
            row_bootstrap.className = "row bootstrap-admin-light-padding-bottom";
            row_bootstrap.id = "row" + parseInt(i / 3);
            panel_content.appendChild(row_bootstrap);
        }
        var col4 = document.createElement("div");
        col4.className = 'col-md-4';
        var img_a = document.createElement("a");
        img_a.href = '/space/' + data.albums[i].name + '/albums/' + data.albums[i].id;
        img_a.className = 'thumbnail';
        var img = document.createElement("img");
        img.title = data.albums[i].title;
        img.dataSrc = "holder.js/260x180";
        img.alt = "260x180";
        img.style.width = '260px';
        img.style.height = '180px';
        img.src = !!!data.albums[i].photos || data.albums[i].photos.length === 0 ? "/images/default_albums_bg.jpg" : "/images" + data.albums[i].photos[0];
        img_a.appendChild(img);

        var p_b = document.createElement("p");
        p_b.innerHTML = '博主：'
        var p_ba = document.createElement("a");
        p_ba.href = '/space/' + data.albums[i].name;
        p_ba.innerHTML = data.albums[i].name;
        p_b.appendChild(p_ba);

        var p_d = document.createElement("p");
        p_d.innerHTML = '日期：' + data.albums[i].day.day;

        col4.appendChild(img_a);
        col4.appendChild(p_b);
        col4.appendChild(p_d);
        panel_content.childNodes.item(panel_content.childNodes.length - 1).appendChild(col4);
    }

    panel.appendChild(panel_heading);
    panel.appendChild(panel_content);

    col.appendChild(panel);
    row.appendChild(col);

    $('#container').append(h1);
    $('#container').append(document.createElement("br"));
    $('#container').append(row);
    resetPages('container', data);
}

function resetPages (id, data) {
    // 分页内容更新
    var page = document.createElement("div");
    page.className = "article";
    page.style.padding = '5px 20px 2px 20px';
    page.style.background = 'none';
    page.style.border = 0;
    page.align = 'center';

    var ul = document.createElement("ul");
    ul.className = 'pagination';

    // 最左边
    var li_l1 = document.createElement("li");
    var li_la1 = document.createElement("a");
    li_la1.href = "#";
    //li_la1.aria-label = "<<";
    li_la1.onclick = function () {
        searchPostsOrAlbums(1);
    };

    var li_lspan1 = document.createElement("span");
    //li_lspan1.aria-hidden = "true";
    li_lspan1.innerHTML = "&laquo;&laquo;";

    li_la1.appendChild(li_lspan1);
    li_l1.appendChild(li_la1);
    ul.appendChild(li_l1);

    // 上一页
    if (data.page != 1) {
        var li_l2 = document.createElement("li");
        var li_la2 = document.createElement("a");
        li_la2.href = "#";
        li_la2.onclick = function () {
            searchPostsOrAlbums(data.page - 1);
        };

        var li_lspan2 = document.createElement("span");
        li_lspan2.innerHTML = "&laquo;";

        li_la2.appendChild(li_lspan2);
        li_l2.appendChild(li_la2);
        ul.appendChild(li_l2);
    }

    // 所有页数
    data.total.forEach(function (page) {
        var li = document.createElement("li");
        var a = document.createElement("a");
        a.href = "#";
        a.onclick = function () {
            searchPostsOrAlbums(page);
        };

        var span = document.createElement("span");
        //li_lspan1.aria-hidden = "true";
        span.innerHTML = (page);
        if (data.page == page) {
            li.className = "active";
        }

        a.appendChild(span);
        li.appendChild(a);
        ul.appendChild(li);
    })

    // 下一页
    if (data.page != data.total[data.total.length - 1]) {
        var li_r1 = document.createElement("li");
        var li_ra1 = document.createElement("a");
        li_ra1.href = "#";
        li_ra1.onclick = function () {
            searchPostsOrAlbums(data.page + 1);
        };

        var li_rspan1 = document.createElement("span");
        li_rspan1.innerHTML = "&raquo;";

        li_ra1.appendChild(li_rspan1);
        li_r1.appendChild(li_ra1);
        ul.appendChild(li_r1);
    }

    // 最后一页
    var li_r2 = document.createElement("li");
    var li_ra2 = document.createElement("a");
    li_ra2.href = "#";
    //li_la1.aria-label = "<<";
    li_ra2.onclick = function () {
        searchPostsOrAlbums(data.total);
    };

    var li_rspan2 = document.createElement("span");
    //li_lspan1.aria-hidden = "true";
    li_rspan2.innerHTML = "&raquo;&raquo;";

    li_ra2.appendChild(li_rspan2);
    li_r2.appendChild(li_ra2);
    ul.appendChild(li_r2);

    page.appendChild(ul);
    $('#' + id).append(page);
}