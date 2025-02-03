$(() => {
  var oTable = $('#example1').DataTable({
    paging: true,
    pageLength: 10,
    processing: true,
    serverSide: true,
    responsive: true,
    ajax: {
      type: 'POST',
      url: '/web/users/table',
    },
    columns:
            [
              {
                data: 'firstName',
                defaultContent: '',
                name: 'نام',
              },
              {
                data: 'lastName',
                defaultContent: '',
                name: 'نام خانوادگی',
              },
              {
                data: 'username',
                defaultContent: '',
                name: 'نام کاربری',
              },
              {
                data: 'gender',
                defaultContent: '',
                name: 'جنسیت',
                render(data, type, row, meta) {
                  // return `<a href="/web/users/${row._id}">${data}</a>`;
                  var gender;
                  if (data === 'F') {
                    gender = 'زن';
                  } else if (data === 'M') {
                    gender = 'مرد';
                  } else {
                    gender = 'مشخص نشده';
                  }
                  return `<small class="label label-primary">${gender}</small>`;
                },
              },
              {
                data: 'birthDate', defaultContent: '', name: 'تاریخ تولد',
              },
              {
                data: 'mobile', defaultContent: '', name: 'همراه', orderable: false,
              },
              {
                data: 'email', defaultContent: '', name: 'ایمیل', orderable: false,
              },
            ],
    initComplete() {
      $('#example1_filter input').unbind();
      $('#example1_filter input').bind('keyup', function (e) {
        if (e.keyCode == 13) {
          oTable.search(this.value).draw();
        }
      });
    },
    language: {
      decimal: '',
      emptyTable: 'اطلاعاتی برای نمایش وجود ندارد',
      info: 'نمایش از رکورد _START_ تا _END_ از مجموع _TOTAL_ رکوزد',
      infoEmpty: '',
      infoFiltered: '(فیلتر شده از مجموع _MAX_ رکورد)',
      infoPostFix: '',
      thousands: ',',
      lengthMenu: 'نمایش _MENU_ رکورد',
      loadingRecords: 'در حال پردازش ...',
      processing: 'در حال پردازش ...',
      search: 'جستجو:',
      zeroRecords: 'هیچ رکوردی یافت نشد',
      paginate: {
        first: 'اول',
        last: 'آخر',
        next: 'بعدی',
        previous: 'قبلی',
      },
    },
  });
});
