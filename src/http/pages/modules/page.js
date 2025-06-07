import { Auth, fetcher } from '@/utils'
import { Module } from '@/models'
import styles from './style.css?inline'

export default function ModulesPage() {
  return /*html*/ `
    <style>${styles}</style>

    <div class="page-wrapper">
      <div class="page-header">
        <h1>Alle Modules</h1>
        <p>Ontdek alle beschikbare modules en lees wat studenten ervan vonden</p>
      </div>

      <div id="modules-container">
        <div class="loading-state">
          <div class="loading-spinner"></div>
          Modules worden geladen...
        </div>
      </div>
    </div>

    <!-- Review Dialog -->
    <div id="review-dialog" class="dialog-overlay">
      <div class="dialog">
        <div class="dialog-header">
          <h2 class="dialog-title">Review toevoegen</h2>
          <p class="dialog-subtitle" id="dialog-module-name"></p>
        </div>
        <div class="dialog-content">
          <div id="review-success" class="success-message" style="display: none;">
            ✅ Je review is succesvol toegevoegd!
          </div>
          <form id="review-form">
            <div class="form-group">
              <label for="review-text" class="form-label">Je review</label>
              <x-multiline-input id="review-text" placeholder="Deel je ervaring met deze module..."></x-multiline-input>
            </div>
          </form>
        </div>
        <div class="dialog-footer">
          <button type="button" class="dialog-button dialog-button-secondary" id="cancel-review">
            Annuleren
          </button>
          <button type="submit" form="review-form" class="dialog-button dialog-button-primary" id="submit-review">
            Review toevoegen
          </button>
        </div>
      </div>
    </div>
  `
}

ModulesPage.onPageLoaded = async () => {
  const container = document.querySelector('#modules-container')
  const reviewDialog = document.querySelector('#review-dialog')
  const reviewForm = document.querySelector('#review-form')
  const cancelButton = document.querySelector('#cancel-review')
  const submitButton = document.querySelector('#submit-review')
  const dialogModuleName = document.querySelector('#dialog-module-name')
  const successMessage = document.querySelector('#review-success')

  let currentModuleId = null

  // Close dialog function
  function closeDialog() {
    reviewDialog.classList.remove('active')
    reviewForm.reset()
    currentModuleId = null
    successMessage.style.display = 'none'
    
    // Reset multiline input if it exists
    const multilineInput = document.querySelector('#review-text')
    if (multilineInput && multilineInput.shadowRoot) {
      const textarea = multilineInput.shadowRoot.querySelector('textarea')
      if (textarea) textarea.value = ''
    }
  }

  // Open dialog function
  function openDialog(moduleId, moduleName) {
    currentModuleId = moduleId
    dialogModuleName.textContent = moduleName
    reviewDialog.classList.add('active')
    successMessage.style.display = 'none'
    
    // Focus on the text input
    setTimeout(() => {
      const multilineInput = document.querySelector('#review-text')
      if (multilineInput && multilineInput.shadowRoot) {
        const textarea = multilineInput.shadowRoot.querySelector('textarea')
        if (textarea) textarea.focus()
      }
    }, 100)
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();
    const hours = String(date.getHours() + 2).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}-${month}-${year} ${hours}:${minutes}`;
  }

  // Event listeners for dialog
  cancelButton.addEventListener('click', closeDialog)
  
  reviewDialog.addEventListener('click', (e) => {
    if (e.target === reviewDialog) {
      closeDialog()
    }
  })

  // Handle form submission
  reviewForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    
    if (!currentModuleId) return

    const multilineInput = document.querySelector('#review-text')
    const reviewText = multilineInput?.shadowRoot?.querySelector('textarea')?.value?.trim()

    if (!reviewText) {
      alert('Voer alstublieft een review in.')
      return
    }

    submitButton.disabled = true
    submitButton.textContent = 'Bezig met opslaan...'

    try {
      await fetcher('ModuleReview', {
        method: 'POST',
        body: {
          moduleId: currentModuleId,
          reviewText: reviewText
        }
      })

      // Show success message
      successMessage.style.display = 'block'
      reviewForm.reset()
      
      // Reset multiline input
      if (multilineInput && multilineInput.shadowRoot) {
        const textarea = multilineInput.shadowRoot.querySelector('textarea')
        if (textarea) textarea.value = ''
      }

      // Reload reviews for this module
      setTimeout(() => {
        loadReviewsForModule(currentModuleId)
        closeDialog()
      }, 1500)

    } catch (err) {
      console.error('Error submitting review:', err)
      alert('Er is een fout opgetreden bij het opslaan van je review. Probeer het opnieuw.')
    } finally {
      submitButton.disabled = false
      submitButton.textContent = 'Review toevoegen'
    }
  })

  // const currentUser = await Auth.getUser()
  const currentUserName = await Auth.getUser()?.displayName
  // Function to load reviews for a specific module
  async function loadReviewsForModule(moduleId) {
    const reviewContainer = document.getElementById(`reviews-${moduleId}`)
    if (!reviewContainer) return

    try {
      reviewContainer.innerHTML = `
        <div class="loading-state">
          <div class="loading-spinner"></div>
          Reviews worden geladen...
        </div>
      `

      const reviews = await fetcher(`ModuleReview/${moduleId}`)
      const hasUserReview = reviews.some(r => r.studentName === currentUserName)

      // Disable review button if user already reviewed
      const reviewBtn = document.querySelector(`[data-module-id="${moduleId}"] .review-button`)
      if (reviewBtn) {
        reviewBtn.disabled = hasUserReview
        reviewBtn.textContent = hasUserReview ? '✅ Review geplaatst' : '📝 Review schrijven'
      }

      if (!reviews || reviews.length === 0) {
        reviewContainer.innerHTML = `
          <div class="empty-state">
            <div class="empty-state-icon">📝</div>
            <div>Nog geen reviews beschikbaar</div>
          </div>
        `
      } else {
        reviewContainer.innerHTML = reviews.map(review => `
          <div class="review-item">
            <div class="review-header">
              <span class="review-student">${review.studentName || 'Student'}</span>
              <span class="review-student">${formatDate(review.createdAt)}</span>

            </div>
            <div class="review-text">${review.reviewText || 'Positieve ervaring met deze module.'}</div>
          </div>
        `).join('')
      }
    } catch (err) {
      reviewContainer.innerHTML = `
        <div class="error-state">
          ⚠️ Kon reviews niet laden
        </div>
      `
      console.error(`Review error for module ${moduleId}`, err)
    }
  }

  try {
    const response = await fetcher('module')
    const modules = response.map(m => Object.assign(new Module(), m))

    container.innerHTML = `
      <div class="modules-grid">
        ${modules.map(module => `
          <div class="module-card fade-in" data-module-id="${module.id}">
            <div class="module-header">
              <h3 class="module-title">${module.name}</h3>
              <div class="module-meta">
                <span class="module-badge">Module</span>
                <button class="review-button" onclick="window.openReviewDialog('${module.id}', '${module.name.replace(/'/g, "\\'")}')">
                  📝 Review schrijven
                </button>
              </div>
            </div>
            <div class="module-content">
              <div class="reviews-section">
                <div class="reviews-header">
                  <span class="reviews-title">Student Reviews</span>
                </div>
                <div id="reviews-${module.id}">
                  <div class="loading-state">
                    <div class="loading-spinner"></div>
                    Reviews worden geladen...
                  </div>
                </div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `

    // Make dialog functions globally available
    window.openReviewDialog = openDialog
    window.loadReviewsForModule = loadReviewsForModule

    // Load reviews for each module
    for (const module of modules) {
      loadReviewsForModule(module.id)
    }

  } catch (err) {
    console.error('Fout bij laden van modules:', err)
    container.innerHTML = `
      <div class="error-state">
        <div style="font-size: 2rem; margin-bottom: 16px;">😔</div>
        <div>Kon modules niet laden. Probeer de pagina te vernieuwen.</div>
      </div>
    `
  }
}