var next_page='http://picostore.vn/api.php';
//var next_page='http://picostore.local/api.php';
var root_page='http://picostore.vn/api.php';
//var root_page='http://picostore.local/api.php';
var current_page_index=0, mySwiper1, featuredSwiper;
var new_app_swiper, hot_app_swiper, top_app_swiper, suggest_app, ad_home;

mySwiper1 = function(){
    $('.thumbs-cotnainer').each(function(){
        $(this).swiper.reInit();
    });
};

function refresh(){
     $('.thumbs-cotnainer').each(function(){
         $(this).swiper({
             slidesPerView:'auto',
             offsetPxBefore:25,
             offsetPxAfter:10,
             calculateHeight: true
         })
     })
}

document.addEventListener("deviceready", onDeviceReady, false);
function onConfirm(buttonIndex) {
            if (buttonIndex == 1)
                navigator.app.exitApp();
}

function onDeviceReady(){
    document.addEventListener("backbutton", function(e){
        if($.mobile.activePage.is('#demo-page')){
            navigator.notification.confirm(
                'Do you really want to exit?.', // message
                onConfirm,            // callback to invoke with index of button pressed
                'Message',           // title
                'Yes,No'         // buttonLabels
            );
        }
        else {
            navigator.app.backHistory()
        }
    }, false);
}

$(document).ready(function() {
    function app_load(url_page, firsttime,type_hot,cate_id,page) {
      //$.mobile.showPageLoadingMsg("a", "Đang tải ứng dụng ...");

       $( "#left-panel" ).panel( "close" );
        $.ajax({
            type: "POST",
            url: url_page,
            data: {
                    action:'category',
                    type:type_hot,
                    _cl_rest:1,
                    category_id: cate_id,
                    page: page,
                  },
            dataType:'jsonp',
            //contentType: 'application/json; charset=utf-8',
            statusCode: {
                404: function() {
                    $("#content").html('Không kết nối được đến.');
                },
                500: function() {
                    $("#content").html('Có lỗi từ phía server.');
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                    console.log(textStatus + ': ' + errorThrown);
                    alert('Error: '+e);

            },
            success: function(data) {
                $.mobile.loading( 'hide');
                var html_content="";
                var template="";
                var coms="";

                jQuery.each(data.result, function(index,val) {
                    var template=$("#app_temp").html();
                    var html = Mustache.render(template, val);
                    html_content=html_content + html;
                });

                $('#new_app_home').hide();
                $('#hot_app_home').hide();
                $('#ad_home').hide();
                $('#top_down_app_home').hide();
                $('#gallery-app').hide();
                $('#app-list-header').show();
                $('#pagination-app').show();

                //hide app detail
                $('#app-detail-info').html('');
                $('#header-same-app').hide();
                $('#same-app').html('');

                //hide  hot, new, top app at home
                $('#new-app-list').html('');
                $('#hot-app-list').html('');
                $('#top-app-list').html('');
                $('#new_app_header').hide();
                $('#hot_app_header').hide();
                $('#top_app_header').hide();

                $('#suggest-app').show();
                $("#app-hot").html(html_content);
                $("#app-hot").listview('refresh');

                if(cate_id != '' && cate_id != 0 && typeof cate_id !== "undefined"){
                    $('#app-list').attr("title",cate_id);
                }else{
                    $('#app-list').attr("title","");
                }

               if(data.result.length > 0){
                   if(page != '' && page != 0 && typeof page !== "undefined"){
                       $('#pageNumber').attr("title",page);
                   }else{
                       $('#pageNumber').attr("title",1);
                   }
               }else{
               html_content = "Không còn dữ liệu, dữ liệu sẽ được cập nhật liên tục, mời bạn ghé thăm PICOSTORE!!";
                   $("#app-hot").html(html_content);
               }
               $('#typeHot').attr("title",type_hot);

               // $(html_content).insertBefore("#hot_app");
           }
       });
     }

    function suggest_app_load(url_page, firsttime,type_cate,cate_id) {
          //$.mobile.showPageLoadingMsg("a", "Đang tải ứng dụng ...");
           $( "#left-panel" ).panel( "close" );
           $('#suggest-app').show();
            $.ajax({
                type: "POST",
                url: url_page,
                data: {
                        action:'category',
                        type:type_cate,
                        _cl_rest:1,
                        category_id: cate_id
                      },
                dataType:'jsonp',
                //contentType: 'application/json; charset=utf-8',
                statusCode: {
                    404: function() {
                        $("#content").html('Không kết nối được đến.');
                    },
                    500: function() {
                        $("#content").html('Có lỗi từ phía server.');
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                        console.log(textStatus + ': ' + errorThrown);
                        alert('Error: '+e);

                },
                success: function(data) {
                    $.mobile.loading( 'hide');
                    var html_content="";
                    var template="";
                    var coms="";
                    jQuery.each(data.result, function(index,val) {
                        var template=$("#suggest_app_temp").html();
                        var html = Mustache.render(template, val);
                        html_content=html_content + html;
                    });
                    $("#suggest-app-list").html(html_content);
                    suggest_app.reInit();
                   // $(html_content).insertBefore("#hot_app");
               }
           });
         }

    function search_app_load(url_page, firsttime, keyword ,cate_id) {

       //$.mobile.showPageLoadingMsg("a", "Đang tải ứng dụng ...");
       $( "#left-panel" ).panel( "close" );
        $.ajax({
            type: "POST",
            url: url_page,
            data: {
                    action:'search',
                    _cl_rest:1,
                    keyword: keyword
                  },
            dataType:'jsonp',
            statusCode: {
                404: function() {
                    $("#content").html('Không kết nối được đến.');
                },
                500: function() {
                    $("#content").html('Có lỗi từ phía server.');
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                    console.log(textStatus + ': ' + errorThrown);
                    alert('Error: '+e);

            },
            success: function(data) {
                $.mobile.loading( 'hide');
                var html_content="";
                var template="";
                var coms="";

                jQuery.each(data.result, function(index,val) {
                    var template=$("#app_temp").html();
                    var html = Mustache.render(template, val);
                    html_content=html_content + html;
                });

                $('#new_app_home').hide();
                $('#hot_app_home').hide();
                $('#ad_home').hide();
                $('#top_down_app_home').hide();

                //hide app detail
                $('#app-detail-info').html('');
                $('#header-same-app').hide();
                $('#pagination-app').hide();
                $('#same-app').html('');

                //hide  hot, new, top app at home
                $('#new-app-list').html('');
                $('#hot-app-list').html('');
                $('#top-app-list').html('');
                $('#new_app_header').hide();
                $('#hot_app_header').hide();
                $('#top_app_header').hide();

                $('#suggest-app').hide();
                $("#app-hot").html(html_content);
                $("#app-hot").listview('refresh');

                if(cate_id != '' && cate_id != 0 && typeof cate_id !== "undefined"){
                    $('#app-list').attr("title",cate_id);
                }
           }
       });
     }

    /*load category*/
    function category_load(url_page) {
        //$.mobile.showPageLoadingMsg("a", "Đang tải ứng dụng ...");
        var html_content="";
        var template="";

        var data = [];
        data[0] = { "category_id": "1", "category_name": "Thể thao" };
        data[1] = { "category_id": "1", "category_name": "Đua xe" };
        data[2] = { "category_id": "1", "category_name": "Bóng đá" };
        data[3] = { "category_id": "1", "category_name": "Mạo hiểm" };
        data[4] = { "category_id": "1", "category_name": "Hành động" };

        jQuery.each(data, function(index,val) {
            var template=$("#category_temp").html();
            var html = Mustache.render(template, val);

            html_content=html_content + html;
        });

        $("#category-List").html(html_content);
        $("#category-List").listview('refresh');
     }

    /*load category*/
    function ad_load(url_page,limit) {
        //Dummy Data
        var html_content="";
        var template="";

        var data = [];
        data[0] = { "link": "#", "image": "http://test.local/picomobile/img/app-1.jpg" };
        data[1] = { "link": "#", "image": "http://test.local/picomobile/img/app-2.jpg" };
        data[2] = { "link": "#", "image": "http://test.local/picomobile/img/app-3.jpg" };
        data[3] = { "link": "#", "image": "http://test.local/picomobile/img/app-4.jpg" };
        data[4] = { "link": "#", "image": "http://test.local/picomobile/img/app-5.jpg" };

        jQuery.each(data, function(index,val) {
            var template = $("#ad_temp").html();

            var html = Mustache.render(template, val);

            html_content = html_content + html;
        });

        console.log(html_content);

        html_content = '';
        $("#ad-list").html(html_content);
        ad_home.reInit();

     }

    function app_load_for_home(url_page, firsttime,type_cate,cate_id, id_item_list,limit,swiper) {
            if(typeof limit == 'undefine'){
                limit = 6;
            }

            //Dummy Data
            var html_content="";
            var template="";

            var data = [];
            data[0] = { "link": "#", "image_small": "./img/app-1.jpg" , 'app_name' : 'Chiến lược', 'category_name' : 'Phiêu lưu'};
            data[1] = { "link": "#", "image_small": "./img/app-2.jpg" , 'app_name' : 'Chiến lược', 'category_name' : 'Phiêu lưu'};
            data[2] = { "link": "#", "image_small": "./img/app-3.png" , 'app_name' : 'Chiến lược', 'category_name' : 'Phiêu lưu'};
            data[3] = { "link": "#", "image_small": "./img/app-4.png" , 'app_name' : 'Chiến lược', 'category_name' : 'Phiêu lưu'};
            data[4] = { "link": "#", "image_small": "./img/app-5.jpg" , 'app_name' : 'Chiến lược', 'category_name' : 'Phiêu lưu'};

            jQuery.each(data, function(index,val) {
                var template = $("#app_temp").html();

                val.app_id = 1;
                var html = Mustache.render(template, val);

                html_content=html_content + html;
            });

            $("#" + id_item_list).html(html_content);

            //mySwiper1.reInit();
            swiper.reInit();

            $("#" + id_item_list).listview('refresh');

            //Actual: Load ajax
         }

    function home_app_load(url_page, firsttime,cate_id) {
          //$.mobile.showPageLoadingMsg("a", "Loading app for you ...");

           $( "#left-panel" ).panel( "close" );
           //lay danh sach ung dung moi
           $('#new_app_home').show();
           $('#hot_app_home').show();
           $('#top_down_app_home').show();
           $('#ad_home').show();

           app_load_for_home(next_page, true, 1, cate_id, 'new-app-list',13,new_app_swiper);
           //lay danh sach ung dung hot
           app_load_for_home(next_page, true, 2, cate_id, 'hot-app-list',13,hot_app_swiper);
           //lay danh sach ung dunng tai nhieu
           app_load_for_home(next_page, true, 3, cate_id, 'top-app-list',13,top_app_swiper);

           ad_load(next_page,6);
           $('.thumbs-cotnainer').each(function(){
             // $(this).reInit();
           });

           //hide app detail
           $('#app-detail-info').html('');
           $('#header-same-app').hide();
           $('#app-list-header').hide();
           $('#gallery-app').hide();
           $('#pagination-app').hide();
           $('#same-app').html('');
           //hide top, new, hot app list
           $('#app-hot').html('');

           //show header top, new, hot app at home pagess
           $('#new_app_header').show();
           $('#hot_app_header').show();
           $('#top_app_header').show();
           $('#suggest-app').show();

           if(cate_id != '' && cate_id != 0 && typeof cate_id !== "undefined"){
               $('#app-list').attr("title",cate_id);
           }else{
               $('#app-list').attr("title","");
           }

           $('#pageNumber').attr("title","");
           $('#typeHot').attr("title","");
    }



    home_app_load(next_page, true, 0);
    category_load(root_page);
    suggest_app_load(next_page, true, 4);

    $("#prev-page").on('click',function(){
        //Lay ra prev number
        pageNumber = $('#pageNumber').attr("title");
        page = parseInt(pageNumber) - 1;
        //Lay ra type_hot
        type_hot =  $('#typeHot').attr("title");

        //Lay ra cate_id
        cate_id =  $('#app-list').attr("title");

        app_load(next_page, true,type_hot,cate_id,page);
    });

    $("#next-page").on('click',function(){
        //Lay ra  next number
        pageNumber = $('#pageNumber').attr("title");
        page = parseInt(pageNumber) + 1;
        //Lay ra type_hot
        type_hot =  $('#typeHot').attr("title");

        //Lay ra cate_id
        cate_id =  $('#app-list').attr("title");

        app_load(next_page, true,type_hot,cate_id,page);
    });

    $("#hot").on('click',function(){
        app_load(next_page, true, 2, $("#app-list").attr('title'));
    });

    $("#new").on('click',function(){
        app_load(next_page, true, 1, $("#app-list").attr('title'));
    });

    $("#topdown").on('click',function(){
        app_load(next_page, true, 3, $("#app-list").attr('title'));
    });

    $("#home").on('click',function(){
        home_app_load(next_page, true, 0);
    });

    /***Get list app when user search****/
    $("#search-app").on('change',function(){
        search_app_load(next_page,true,$(this).val());
    });

    $("#mysearchbox").on('click', function(){
        $("#search-basic").toggle("slow");
    });

    $("#searchfooter").on('click', function(){
        $("#search-basic").toggle("slow");
    });

    $('body').on('click', 'li', function() {
    });
});