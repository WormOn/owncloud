// declare namespace
var StorageCharts2 = StorageCharts2 || {};



StorageCharts2.getUserFromId = function (uid) {
    if (StorageCharts2.users) {
        if (StorageCharts2.users[uid]) {
            return StorageCharts2.users[uid].displayName;
        } else {
            return uid;
        }
    } else {
        return uid;
    }
}


StorageCharts2.evalResponse = function (data) {
    if (data) {
        StorageCharts2.users = {};
        for (var id in data.users) {
            var userDetails = JSON.parse(data.users[id]);
            StorageCharts2.users[userDetails.name] = userDetails;
        }
        if (data.chart) {
        	StorageCharts2.runEval(data.chart);
        }
    }
}

StorageCharts2.runEval = function (cmd) {
	eval(cmd);
}

// TODO include correct callback
StorageCharts2.getLinesUsseUnitsSelect = function(s) {

  $('#clines_usse h3').append(
      '<span id="selunits"><span id="selloader"></span><select id="chunits"><option value="1"'
	  + (s == 1 ? ' selected' : '') + '>' + t('storage_charts', 'Kilobytes (KB)') + '</option><option value="2"'
	  + (s == 2 ? ' selected' : '') + '>' + t('storage_charts', 'Megabytes (MB)') + '</option><option value="3"'
	  + (s == 3 ? ' selected' : '') + '>' + t('storage_charts', 'Gigabytes (GB)') + '</option><option value="4"'
	  + (s == 4 ? ' selected' : '') + '>' + t('storage_charts', 'Terabytes (TB)') + '</option></select></span>');
  $('#chunits').chosen();
  $('#chunits').change(function() {
    $('#selloader').html('<img src="' + OC.imagePath('storage_charts', 'loader.gif') + '" />');
    $.ajax({
      type : 'POST',
      url : OC.linkTo('storage_charts', 'ajax/data.php'),
      dataType : 'json',
      data : {
	s : $('#chunits').val(),
	k : 'hu_size'
      },
      async : true,
      success : function(s) {
	eval(s.r);
	$('#selloader img').remove();
      }
    });
  });
}

// TODO include correct callback
StorageCharts2.getHistoUsUnitsSelect = function(s) {

  $('#chisto_us h3').append(
      '<span id="selunits_hus"><span id="selloader_hus"></span><select id="chunits_hus"><option value="1"'
	  + (s == 1 ? ' selected' : '') + '>' + t('storage_charts', 'Kilobytes (KB)') + '</option><option value="2"'
	  + (s == 2 ? ' selected' : '') + '>' + t('storage_charts', 'Megabytes (MB)') + '</option><option value="3"'
	  + (s == 3 ? ' selected' : '') + '>' + t('storage_charts', 'Gigabytes (GB)') + '</option><option value="4"'
	  + (s == 4 ? ' selected' : '') + '>' + t('storage_charts', 'Terabytes (TB)') + '</option></select></span>');
  $('#chunits_hus').chosen();
  $('#chunits_hus').change(function() {
    $('#selloader_hus').html('<img src="' + OC.imagePath('storage_charts', 'loader.gif') + '" />');
    $.ajax({
      type : 'POST',
      url : OC.linkTo('storage_charts', 'ajax/data.php'),
      dataType : 'json',
      data : {
	s : $('#chunits_hus').val(),
	k : 'hu_size_hus'
      },
      async : true,
      success : function(s) {
	eval(s.r);
	$('#selloader_hus img').remove();
      }
    });
  });
}

/**
 * Init storage usage charts
 */
StorageCharts2.init = function() {
  if ($('#clines_usse').size() > 0) {
    // TODO unit selection
    // StorageCharts2.getLinesUsseUnitsSelect($('#storagecharts2').data('sc-size'));
	  
	  // load monthly used chart
    $.post(OC.filePath('storagecharts2', 'ajax', 'data.php'), {
      's' : $('#storagecharts2').data('sc-size-hus'),
      'k' : 'hu_size'
    }, function(response) {
      StorageCharts2.evalResponse(response.data);       
    });
  }
  if ($('#chisto_us').size() > 0) {
    // TODO unit selection
    // StorageCharts2.getHistoUsUnitsSelect($('#storagecharts2').data('sc-size-hus'));
    $.post(OC.filePath('storagecharts2', 'ajax', 'data.php'), {
      's' : $('#storagecharts2').data('sc-size-hus'),
      'k' : 'hu_size_hus'
    }, function(response) {
      StorageCharts2.evalResponse(response.data);       
    });
  }
  if ($('#cpie_rfsus').size() > 0) {
    $.post(OC.filePath('storagecharts2', 'ajax', 'data.php'), {
      'k' : 'hu_ratio'
    }, function(response) {
      StorageCharts2.evalResponse(response.data);       
    });
  }
  $('#stc_sortable').sortable({
    axis : 'y',
    handle : 'h3',
    placeholder : 'ui-state-highlight',
    update : function(e, u) {
    	$.post(OC.filePath('storagecharts2', 'ajax', 'userSettings.php'), {
		    'o' : 'set',
		    'k' : 'sc_sort',
		    'i' : $('#stc_sortable').sortable('toArray')
    	}, function(data) {
         console.log('Done');
        });
    }
  });
  $('#stc_sortable').disableSelection();
}

// init sorting
$(document).ready(function() {
  StorageCharts2.init();
});
