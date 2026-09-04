document.addEventListener('DOMContentLoaded', function(){
  // handle preorder CTA
  document.querySelectorAll('.preorder-btn').forEach(function(btn){
    btn.addEventListener('click', function(){
      var variantId = btn.getAttribute('data-variant-id');
      if(!variantId) return;
      btn.disabled = true;
      btn.textContent = 'Adding…';

      fetch('/cart/add.js', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({id: variantId, quantity:1})
      }).then(function(res){
        if(!res.ok) throw new Error('Add failed');
        // go straight to checkout for full preorder payment
        window.location.href = '/checkout';
      }).catch(function(err){
        console.error(err);
        btn.disabled = false;
        btn.textContent = 'Preorder Now';
        alert('Could not add to cart. Please try again.');
      });
    });
  });

  // countdown timers
  document.querySelectorAll('.preorder-countdown').forEach(function(el){
    var end = el.getAttribute('data-end');
    if(!end) return;
    var endTs = Date.parse(end);
    if(isNaN(endTs)) return;

    function update(){
      var now = Date.now();
      var diff = endTs - now;
      if(diff <= 0){ el.textContent = 'Preorders closing soon'; clearInterval(iv); return; }
      var days = Math.floor(diff/86400000); diff%=86400000;
      var hours = Math.floor(diff/3600000); diff%=3600000;
      var mins = Math.floor(diff/60000); diff%=60000;
      var secs = Math.floor(diff/1000);
      el.textContent = (days?days+'d ':'') + hours.toString().padStart(2,'0') + ':' + mins.toString().padStart(2,'0') + ':' + secs.toString().padStart(2,'0');
    }
    update();
    var iv = setInterval(update,1000);
  });

  // simple intersection observer for in-view transitions
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){ entry.target.classList.add('in-view'); io.unobserve(entry.target); }
    });
  },{threshold:0.12});

  document.querySelectorAll('.preorder-hero').forEach(function(section){ io.observe(section); });
});
