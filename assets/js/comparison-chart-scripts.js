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

  // Apply classes to section root to only show selected robots
  $('.comparison-chart .compare-btn').click(function (e) {
    var $chartTable = $('.comparison-chart table').removeAttr('class');
    var optionCount = $('.comparison-chart .compare-options').attr('data-option-count')
    $('.comparison-chart .option-checkbox:checked').each(function () {
      $chartTable.addClass('col-' + (optionCount - this.getAttribute('data-option-index')));
    });
    $('.comparison-chart').addClass('comparison-active');
    $('html, body').animate({ scrollTop: $('.comparison-chart .body-region').offset().top - 15 }, 500);
  });

  // Reset the chart (remove selected robot classes from section root)
  $('.comparison-chart .reset-btn').click(function (e) {
    $('.comparison-chart .option-checkbox').prop('checked', false).attr('disabled', false);
    $('.comparison-chart .compare-btn').attr('disabled', true);
    $('.comparison-chart').removeClass('comparison-active show-compare-hint');
    $('.comparison-chart table').removeAttr('class');
    $('html, body').animate({ scrollTop: $('.page-anchor[id="Compare-Robots"]').offset().top }, 500);
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
});