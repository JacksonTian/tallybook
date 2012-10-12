var Plus = {};
Plus.columns = function (table, columns) {
  var ret = [];
  for (var i = 0, l = table.length; i < l; i++) {
    var row = table[i];
    var _row = [];
    for (var j = 0, k = columns.length; j < k; j++) {
      _row.push(row[columns[j]]);
    }
    ret.push(_row);
  }
  return ret;
};

Plus.column = function (table, column) {
  return _.chain(table).map(function (val, key) {
    return val[column];
  }).value();
};

Plus.count = function (table, col) {
  var ret = _.chain(table).groupBy(function (val) {
      return val;
    }).map(function (val, key) {
      return [key, val.length];
    }).value();
  return ret;
};

var App = new Scape();
Land("header", function (view) {
  var activityNode = view.$("#activity");
  var amountNode = view.$("#amount");
  var subjectNode = view.$("#subject");
  view.delegate("button", "click", function () {
    var data = {
      "activity": activityNode.val(),
      "amount": amountNode.val(),
      "subject": subjectNode.val()
    };
    $.ajax({
      url: '/add',
      type: "POST",
      data: data,
      success: function (result) {
        App.set('refresh', true);
      },
      error: function () {

      },
      complete: function () {

      }
    });
  });
});

Land("#content", function (view) {
  App.ready('refresh', function (val) {
    $.ajax({
      url: '/all',
      success: function (result) {
        App.set('render', result);
      },
      error: function () {

      }
    });
    // view.$("#table").empty();
    // view.$("#container").empty();
  });

  App.set('refresh', true);

  App.ready('render', function (event) {
    var list = event.newVal;
    var html = '<table class="table-bordered">';
    for (i = 0, l = list.length; i < l; i++) {
      row = _.values(list[i]);
      html += '<tr>';
      for (j = 0, k = row.length; j < k; j++) {
        html += '<td>' + row[j] + '</td>';
      }
      html += '</tr>';
    }
    html += '</table>';
    view.$("#table").html(html);
  });

  App.ready("show_chart", function (event) {
    view.$("#visual").removeClass("hidden");
    var source = App.get('render');
    source = source.filter(function (item) {
      return item.activity && item.amount && $.isNumeric(item.amount);
    }).map(function (item) {
      return [item["activity"], item["amount"]];
    });
    source = _.zip.apply(_, source);
    var container = $("#container");
    var pie = new Pie("container", {
      width: container.width() - 20,
      height: container.height() - 20,
      tag: true
    });

    pie.setSource(source);
    pie.render();
  });
});

Land("aside", function (view) {
  view.$(".hd").delegate(".select", "click", function () {
    App.set("show_chart", true);
  });
});

Land("footer", function (view) {
  view.element.html("@DataV");
});
