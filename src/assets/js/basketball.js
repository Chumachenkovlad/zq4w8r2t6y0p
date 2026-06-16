  const exerciseIds = Array.from(document.querySelectorAll('.exercise')).map(e => e.dataset.id);

  document.getElementById('totalCount').textContent = exerciseIds.length;

  // Tabs
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(tab.dataset.tab).classList.add('active');
    });
  });

  // Expand exercise
  function toggleExercise(el) {
    el.parentElement.classList.toggle('expanded');
  }

  // Check/uncheck
  async function toggleCheck(event, el) {
    event.stopPropagation();
    const exercise = el.closest('.exercise');
    const id = exercise.dataset.id;
    exercise.classList.toggle('completed');
    const isCompleted = exercise.classList.contains('completed');

    try {
      if (isCompleted) {
        await window.storage.set('ex:' + id, 'done');
      } else {
        await window.storage.delete('ex:' + id);
      }
    } catch (e) {
      console.error('Storage error:', e);
    }

    updateProgress();
  }

  function updateProgress() {
    const completed = document.querySelectorAll('.exercise.completed').length;
    const total = exerciseIds.length;
    document.getElementById('completedCount').textContent = completed;
    document.getElementById('progressFill').style.width = (completed / total * 100) + '%';
  }

  async function resetProgress() {
    if (!confirm('Скинути весь прогрес?')) return;
    for (const id of exerciseIds) {
      try {
        await window.storage.delete('ex:' + id);
      } catch (e) {}
    }
    document.querySelectorAll('.exercise.completed').forEach(ex => ex.classList.remove('completed'));
    updateProgress();
  }

  // Load progress on start
  async function loadProgress() {
    for (const id of exerciseIds) {
      try {
        const result = await window.storage.get('ex:' + id);
        if (result && result.value === 'done') {
          const ex = document.querySelector(`[data-id="${id}"]`);
          if (ex) ex.classList.add('completed');
        }
      } catch (e) {
        // Key doesn't exist
      }
    }
    updateProgress();
  }

  loadProgress();
