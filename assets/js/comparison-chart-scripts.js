$(function() {
  /* === COMPARISON CHART === */
  // Only allow to robots to be selected at once
  $('.comparison-chart .option-checkbox').on('change', function (e) {
    var checkedBoxCount = $('.comparison-chart .option-checkbox:checked').length;
    if (checkedBoxCount > 2) {
      $('.comparison-chart .option-checkbox:not(:checked)').attr('disabled', true);
    } else {
      $('.comparison-chart .option-checkbox:not(:checked)').removeAttr('disabled');
    }
    $('.comparison-chart .compare-btn').attr('disabled', !checkedBoxCount);
    $('.comparison-chart').addClass('show-compare-hint');
  });

  $('.comparison-chart .robot-info-inner').on('click', function (e) {
    var index = $(this).attr('data-option-index');
    $('.comparison-chart .option-checkbox[data-option-index="' + index+ '"').trigger('click');
    $('.comparison-chart .compare-btn').trigger('click');
  });

  // Apply classes to section root to only show selected robots
  $('.comparison-chart .compare-btn').click(function (e) {
    var $chartTable = $('.comparison-chart table').removeAttr('class');
    var optionCount = $('.comparison-chart .compare-options').attr('data-option-count');
    var selected = 0;
    $('.comparison-chart .robot-info-inner').removeClass('active');
    $('.comparison-chart .option-checkbox:checked').each(function () {
      $('.comparison-chart .robot-info-inner[data-option-index="' + this.getAttribute('data-option-index') + '"').addClass('active');
      $chartTable.addClass('col-' + (optionCount - this.getAttribute('data-option-index')));
      selected++;
    });
    $('.comparison-chart').addClass('comparison-active');

    // Show all of the rows in the table
    toggleRows();

    
    if (selected > 0) {
      $('.comparison-chart .body-region').show();
      $('html, body').animate({ scrollTop: $('.comparison-chart .body-region').offset().top - 15 }, 500);      
    } else {
      $('html, body').animate({ scrollTop: $('.page-anchor[id="Compare-Robots"]').offset().top}, 500, 'swing', function () {
        $('.comparison-chart .body-region').hide();
      });      
    }
  });

  // Reset the chart (remove selected robot classes from section root)
  $('.comparison-chart .reset-btn').click(function (e) {
    $('.comparison-chart .option-checkbox').prop('checked', false).attr('disabled', false);
    $('.comparison-chart .compare-btn').attr('disabled', true);
    $('.comparison-chart').removeClass('comparison-active show-compare-hint');
    $('.comparison-chart table').removeAttr('class');
    
    // Reset the collapse button
    $('.comparison-chart .collapse-btn').attr('data-active', 'false');
    $('.comparison-chart .collapse-btn').text('Load More Features');

    // Reset the diff button
    $('.comparison-chart .diff-btn').attr('data-active', 'false');
    $('.comparison-chart .diff-btn').text('Show Only Differences');   
    
    toggleRows();

    $('html, body').animate({ scrollTop: $('.page-anchor[id="Compare-Robots"]').offset().top }, 500);
  });

  $('.comparison-chart .collapse-btn').click(function () {
    var active = $('.comparison-chart .collapse-btn').attr('data-active');
    $('.comparison-chart .collapse-btn').attr('data-active', active === 'true' ? 'false' : 'true');
    $('.comparison-chart .collapse-btn').text(active === 'true' ? 'Load More Features' : 'Show Less Features');
    toggleRows();
  });

  // Show only differences in the chart
  $('.comparison-chart .diff-btn').click(function () {
    var active = $('.comparison-chart .diff-btn').attr('data-active');
    $('.comparison-chart .diff-btn').attr('data-active', active === 'true' ? 'false' : 'true');
    $('.comparison-chart .diff-btn').text(active === 'true' ? 'Show Only Differences' : 'Show All Features');
    toggleRows();
  });

  // Show desktop tooltips
  $('.comparison-chart .has-tooltip').click(function (e) {
    e.stopPropagation();
    if (window.matchMedia && window.matchMedia('(max-width: 768px)').matches) {
      return;
    }

    var $this = $(this);
    var $parent = $this.parent();
    $parent.siblings().find('.has-tooltip.active').removeClass('active');
    $this.addClass('active');
  });

  // Show mobile tooltips
  $('.comparison-chart .has-tooltip ~ .true').click(function (e) {
    e.stopPropagation();
    if (window.matchMedia && window.matchMedia('(max-width: 767px)').matches) {
      $('.comparison-chart .availability').removeClass('active');
      $(this).addClass('active');
    }
  });

  // Body click tasks (mostly deactiviting interactive elements)
  $(document.body).on('click touchstart', function () {
    // Hide all compare-chart tooltips
    $('.comparison-chart .has-tooltip.active, .comparison-chart .availability.active').removeClass('active');
  });

  $(window).on('resize', function () {
    toggleRows();
  });

  function toggleRows() {
    var maxRows = getMaxNumRows();
    var diffActive = $('.comparison-chart .diff-btn').attr('data-active') === 'true';

    if (!diffActive) {
      $('.comparison-chart table tbody tr:lt(' + maxRows + ')').show();
      $('.comparison-chart table tbody tr:gt(' + maxRows + ')').hide();
      return;
    }

    // Show All Rows
    $('.comparison-chart table tbody tr').show();

    var visibleRows = [];
    // Show only differences
    $('.comparison-chart table tbody tr').each(function (index, row) {
      // Map the tds in the row to an array of objects for comparrable availability
      var tds = $(row).find('td:visible')    
        .map(function (index, td) {
          return {
            html: $(td).html(),
            classname: $(td).attr('class')
          }
        })
        .toArray();

      // Reduce all of the tds down to see if the row should be visible or not
      var visible = tds.reduce(function (visible, td) {
        // Get all of the tds with the same class & html as the current td
        var found = tds.filter(function (a) {
          return a.classname === td.classname && a.html === td.html;
        });

        // If the tds all are the same, then set the visibility to hidden
        if (found.length === tds.length) {
          visible = false;
        }

        return visible;
      }, true);

      if (visible) {
        visibleRows.push(index);
      }
    });    

    // Take only the first X number of rows (5 for mobile & all for desktop)
    visibleRows = visibleRows.slice(0, maxRows);

    $('.comparison-chart table tbody tr').each(function (index, row) {
      if (visibleRows.indexOf(index) !== -1) {
        $(row).show();
      } else {
        $(row).hide();
      }
    });
  }

  function getMaxNumRows () {
    return isMobile() && isCollapsed() ? 5 : $('.comparison-chart table tbody tr').length;
  }

  function isMobile () {
    return $(window).width() <= 768;
  }

  function isCollapsed () {
    return $('.comparison-chart .collapse-btn').attr('data-active') === 'false';
  }

  toggleRows();
});