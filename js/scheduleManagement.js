var prev = -1;
var f = 0;

const mysql = require('mysql');

const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '5588',
  database: 'CENG'
});
con.connect((err) => {
  if(err){
    console.log('Error connecting to Db');
    return;
  }
  console.log('Connection established');
});

window.addEventListener('load', function() {
  $query = 'SELECT * FROM Course WHERE status = 1 and courseCode like ?';
  con.query($query, "CENG 1%", function(err, rows) {
      if(err){
          console.log("An error ocurred performing the query.");
          console.log(err);
          return;
      }
      var element = document.getElementsByClassName('courses')[0]
      for (let i = 0; i < rows.length; i++) {
        var course = rows[i]["courseCode"]
        var str = '<tr><td><div class="item">'+course+'</div></td></tr>'

        element.insertAdjacentHTML( 'afterbegin', str );
      }
      $(function(){
        $('.item').draggable({
          revert:true,
          proxy:'clone'
        });
        $('.right td.drop').droppable({
          onDragEnter:function(){
            $(this).addClass('over');
            if (!f) {
              prev = this.id;
              f = 1;
            }
          },
          onDragLeave:function(){
            if (!f) {
              prev = this.id;
              f = 1;
            }
            $(this).removeClass('over');
          },
          onDrop:function(e,source){
            f = 0;
            $(this).removeClass('over');
            if ($(source).hasClass('assigned')){
              $(this).append(source);
            } else {
              prev = -1;
              var c = $(source).clone().addClass('assigned');
              $(this).append(c);
              c.draggable({
                revert:true
              });
            }
            console.log('current: ' + this.id);
            console.log('prev: ' + prev);
          }
        });
        $('.trsh').droppable({
          accept:'.assigned',
          onDragEnter:function(e,source){
            $(source).addClass('trash');
          },
          onDragLeave:function(e,source){
            $(source).removeClass('trash');
          },
          onDrop:function(e,source){
            $(source).remove();
            console.log(prev);
            f = 0;
          }
        });
      });
  });
})

