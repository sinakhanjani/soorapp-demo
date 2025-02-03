$(function () {

    var oTable = $('#example1').DataTable( {
        "paging": true,
        "pageLength": 10,
        "processing": true,
        "serverSide": true,
        'ajax': {
            'type': 'POST',
            'url': '/web/testsAjax'
        },
        'columns':
            [
                {
                    'data': 'firstName', "defaultContent": "", 'name': 'نام', 'orderable': false,
                    'render': function(data, type, row, meta){
                        return '<a href="/web/users/' + row.userID + '">' + data + '</a>';
                    }
                },
                {
                    'data': 'lastName', "defaultContent": "", 'name': 'نام خانوادگی', 'orderable': false,
                    'render': function(data, type, row, meta){
                        return '<a href="/web/users/' + row.userID + '">' + data + '</a>';
                    }
                },
                {
                    'data': 'melliCode', "defaultContent": "", 'name': 'کد ملی', 'orderable': false,
                    'render': function(data, type, row, meta){
                        return '<a href="/web/users/' + row.userID + '">' + data + '</a>';
                    }
                },
                {'data': 'category', "defaultContent": "", 'name': 'دسته آزمایش', 'orderable': false},
                {'data': 'name', "defaultContent": "", 'name': 'عنوان', 'orderable': false},
                {'data': 'date', "defaultContent": "", 'name': 'تاریخ آزمایش', 'orderable': false},
                {
                    'data': 'filePath', "defaultContent": "", 'name': 'فایل آزمایش',
                    'searchable': false,
                    'orderable': false,
                    'render': function(data, type, row, meta){

                        let htmlData = '';
                        if(data){
                            htmlData += '<a href="' + data + '"><button class="btn btn-sm btn-primary">مشاهده نتیجه</button></a>'
                        }
                        return htmlData;
                    }
                },
                {
                    'data': '_id', "defaultContent": "", 'name': 'ویرایش',
                    'orderable': false,
                    'render': function(data, type, row, meta){

                        let htmlData = '';

                        if(data.filePath){
                            htmlData += '<a href="' + data.filePath + '"><button class="btn btn-sm btn-primary">مشاهده نتیجه</button></a>'
                        }
                        htmlData += '<a href="/web/tests/' + data + '/edit"><button class="btn btn-sm btn-warning">ویرایش</button></a>';
                        htmlData += '<form action="/web/tests/' + data + '/delete" method="POST" style="display: inline-block"><button class="btn btn-sm btn-danger" style="margin-right: 3px" type="submit">حذف</button></form>';

                        return htmlData;
                    }
                }
            ],
        "initComplete": function() {
            $('#example1_filter input').unbind();
            $('#example1_filter input').bind('keyup', function(e) {
                if(e.keyCode == 13) {
                    oTable.search( this.value ).draw();
                }
            });
        }
    } );
})