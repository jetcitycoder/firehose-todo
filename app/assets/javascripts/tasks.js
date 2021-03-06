$(function() {

  // taskHtml reformats tasks from JSON to HTML list items
  function taskHtml(task) {
    var checkedStatus = task.done ? 'checked' : '';
    var liClass = task.done ? 'completed' : '';
    var liElement = '<li id="listItem-' + task.id + '" class="' + liClass +
    '"><div class="view"><input class="toggle" type="checkbox" data-id="' +
    task.id + '"' + checkedStatus + ' /><label>' + task.title + '</label></div></li>';

    return liElement;
  }

  // toggleTask updates database when checkbox is toggled
  function toggleTask(e) {
    var itemID = $(e.target).data('id');
    var doneValue = Boolean($(e.target).is(':checked'));

    $.post('/tasks/' + itemID, {
      _method: 'PUT',
      task: {
        done: doneValue
      }
    }).success(function(data) {
      $('#listItem-' + data.id).replaceWith(taskHtml(data));
      $('.toggle').click(toggleTask);
    });
  }

  // Gets tasks and displays on page
  $.get('/tasks').success(function(data) {
    var htmlString = '';

    $.each(data, function(index, task) {
      htmlString += taskHtml(task);
    });
    $('.todo-list').html(htmlString);

    $('.toggle').change(toggleTask);
  });

  // Creates new tasks from form input and displays on page
  $('#new-form').submit(function(event) {
    event.preventDefault();
    var textbox = $('.new-todo');
    var payload = {
      task: {
        title: textbox.val()
      }
    }
    $.post('/tasks/', payload).success(function(data) {
      $('.todo-list').append(taskHtml(data));
      $('.toggle').click(toggleTask);
      $('.new-todo').val('');
    });
  });
});
