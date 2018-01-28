$(document).ready(function () {

    // Get all Data
    $.getJSON("/api/todos")
        .then(function (data) {
            // console.log(data);
            addTodos(data);
        })
        .catch(function (e) {
            console.log(e);
        })

    $("#todoInput").keypress(function (e) {
        if (e.which == 13) {

            createTodo();
        }

    });

    $(".list").on("click","span",function(e){
        var deleteId=this.parentElement.id;
        var delurl="/api/todos/"+ deleteId;
        e.stopPropagation();
        $(this).parent().remove();
        $.ajax
        ({
            type: "DELETE",           
            url: delurl,            
            success: function (data) {
               console.log(data);
            },
            error: function (x, e) {
                console.log("Failure at delete api");
            }
        });
    })
    $(".list").on("click","li",function(){
        var uId=this.id;
        var updateurl="/api/todos/"+ uId;
        var IsCompleted=!($(this).data('completed'));        
        var obj={completed:IsCompleted}
        $.ajax
        ({
            type: "PUT",           
            url: updateurl, 
            data:obj,           
            success: function (data) {
               console.log(data);
               $("#"+data._id).toggleClass('done');
               $(this).attr('completed',IsCompleted);
               
            },
            error: function (x, e) {
                console.log("Failure at delete api");
            }
        });
        console.log(obj);
    })
});

function addTodos(todos) {
    todos.forEach(element => {
        addTodo(element);
    });
}

function addTodo(element) {
    var todoI = $("<li class='task' id=" + element._id + ">" + element.name + " <span>X</span></li>");
    todoI.data('completed',element.completed);
    if (element.completed) {
        todoI.addClass('done');
    }
    $(".list").append(todoI);
}

function createTodo() {
    var name = $("#todoInput").val();
    $.post('/api/todos', {
            name: name
        })
        .then(function (newtodo) {
            $("#todoInput").val('');
            addTodo(newtodo);
        })
        .catch(function (err) {
            console.log(err);
        });
}