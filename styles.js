let styles = `
  .create-note-view {
    display: grid;
    grid-template-areas: "topbar" "content";
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
    height: 100vh;
    max-height: -webkit-fill-available;
    overflow: hidden;
    overflow-y: auto;
    box-sizing: border-box;
  }
  .note-editor {
   padding: .25rem 1.8rem;
  }
  .note-content {
    grid-area: content;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    width: 100%;
    box-sizing: border-box;
    flex: 1;
  }
  .create-note-content {
    composes: note-content;
  }
  
  .note-edit-textarea {
    flex: 1;
    width: 100%;
    height: 100%;
    padding: 1rem;
    border: 1px solid transparent;
    border-radius: 4px;
    font-family: inherit;
    line-height: 1.6;
    resize: vertical;
    box-sizing: border-box;
    background: transparent;
    transition: all 0.2s ease;
  }
  
  .create-note-submit {
    z-index: 1;
    background-color: #007bff;
    color: white;
    padding: 0.75rem 1.5rem;
    width: 100%;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1.2rem;
    font-weight: 500;
    transition: background-color 0.2s;
  }
  
  .create-note-submit:hover {
    background: #1976D2;
  }
  
  .home-section {
    position: relative;
    height: 100%;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
    grid-template-areas: 
      "search"
      "notes";
    gap: 1rem;
  }
  
  .search-bar-wrapper {
    position: sticky;
    top: 60px;
    background: rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(5px);
    z-index: 2;
  }
  
  .search-bar {
    display: flex;
    align-items: center;
    background: transparent;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    overflow: hidden;
    transition: all 0.2s ease;
  }
  
  .search-bar:focus-within {
    border-color: rgba(0, 0, 0, 0.2);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }
  
  .search-input {
    flex: 1;
    padding: 0.75rem;
    border: none;
    background: transparent;
    font-size: 1rem;
    color: #333;
    outline: none;
  }
  
  .search-button {
    background: transparent;
    border: none;
    padding: 0.75rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s ease;
    border-radius: 8px 0 0 8px;
  }
  
  .search-button:hover,
  .search-button:focus {
    background-color: rgba(0, 0, 0, 0.05);
  }
  
  .search-button img {
    width: 28px;
    height: 28px;
  }

  .tag-edit-input {
    width: 100%;
    padding: 0;
    margin: 0;
    border: none;
    border-bottom: 1px solid transparent;
    font-family: inherit;
    font-size: 0.9rem;
    background: transparent;
    color: #666;
    transition: all 0.2s ease;
    box-sizing: border-box;
    max-width: 100%;
  }

  .tag-edit-input:focus {
    border-bottom-color: #ddd;
    outline: none;
    background-color: transparent;
  }
  .note-edit-textarea:focus {
    border-color: #ddd;
    background-color: rgba(255, 255, 255, 0.9);
    outline: none;
  }
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .modal-content {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    max-width: 400px;
    width: 90%;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  
  .modal-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: #333;
  }
  
  .modal-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 1.5rem;
  }
  
  .modal-button {
    padding: 0.5rem 1rem;
    border-radius: 4px;
    border: none;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s;
  }
  
  .modal-button.cancel {
    background: #f0f0f0;
    color: #333;
  }
  
  .modal-button.delete {
    background: #ff4444;
    color: white;
  }
  
  .modal-button:hover {
    opacity: 0.9;
  }
  
  .note-top-bar {
    justify-content: space-between;
  }
  
  .delete-button {
    background: none;
    border: none;
    padding: 0.5rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    transition: opacity 0.2s;
  }
  
  .delete-button:hover {
    opacity: 0.7;
  }
  
  .delete-button img {
    width: 24px;
    height: 24px;
  }
  .note-view {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
    grid-template-areas:
      "topbar"
      "content";
    height: 100%;
    overflow: hidden;
    max-width: 100%;
  }
  
  .note-view .note-top-bar {
    grid-area: topbar;
  }
  
  .note-view .note-content {
    grid-area: content;
    overflow-y: auto;
  }

  .note-metadata {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 0.5rem 1rem;
    padding: 0 1rem;
    color: #666;
    font-size: 0.9rem;
  }
  .metadata-label {
    font-weight: 500;
    color: #555;
  }
  .metadata-content {
    color: #666;
  }
  
  .note-header {
    padding: 1rem;
    background: rgba(255, 255, 255, 0.05);
    width: 100%;
    box-sizing: border-box;
    overflow: hidden;
  }

  .note-top-bar {
    padding: 0.5rem 1.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .note-top-bar-left,
  .note-top-bar-right {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .note-button {
    background: none;
    border: none;
    padding: 0.5rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    transition: opacity 0.2s;
  }
  
  .note-button:hover {
    opacity: 0.7;
  }

  .note-button img {
    width: 22px; /* Decreased by ~35% from 34px */
    height: 22px; /* Decreased by ~35% from 34px */
  }
  .back-button {
    background: none;
    border: none;
    padding: 0.8rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    transition: opacity 0.2s;
  }
  .back-button:hover {
    opacity: 0.7;
  }
  .back-button img {
    width: 34px;
    height: 34px;
  }
  .last-edited {
    margin-bottom: 0.5rem;
  }
  .tags {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }
  .tag {
    background: #f0f0f0;
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.8rem;
  }
  .note-text {
    white-space: pre-wrap;
    line-height: 1.6;
    color: #444;
  }
  .notes-list {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .note-item {
    width: 100%;
    padding: 1rem;
    background: #ffffff;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    cursor: pointer;
    margin: 0;
    text-align: left;
    transition: all 0.2s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .note-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  .note-title {
    margin: 0 0 0.75rem 0;
    font-size: 1.3rem;
    line-height: 1.3;
    font-weight: 700;
    color: #333;
    width: 100%;
  }
  
  .note-title-input {
    margin: 0 0 8px 0;
    font-weight: 600;
    border: 1px solid transparent;
    border-radius: 4px;
    transition: all 0.2s ease;
    width: 100%;
    font-size: 1.7rem;
    padding: 1.25rem;
    line-height: 1.4;
  }
  
  .note-title-input:focus {
    border-color: #ddd;
    background-color: rgba(255, 255, 255, 0.9);
    outline: none;
  }
  .note-tags {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    margin: 0.25rem 0;
  }
  .note-tag {
    background: rgba(0, 0, 0, 0.05);
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.8rem;
    color: #666;
  }
  .note-preview {
    margin: 0;
    font-size: 0.9rem;
    color: #666;
    line-height: 1.4;
  }
  .notes-loading,
  .notes-error,
  .no-notes {
    padding: 2rem;
    text-align: center;
    color: #666;
  }
  /* Create Note Button styles */
  .create-note-button {
    position: absolute;
    bottom: 1rem;
    right: 1rem;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background-color: #007bff;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 4px rgba(0,0,0,0.15);
    transition: transform 0.2s, box-shadow 0.2s, rotate 0.2s ease-in-out;
    z-index: 10;
  }
  
  .create-note-button:hover {
    transform: translateY(-1px) scale(1.05) rotate(90deg);
    box-shadow: 0 3px 6px rgba(0,0,0,0.2);
  }
  
  .create-note-button img {
    width: 24px;
    height: 24px;
    filter: brightness(0) invert(1);
  }
  

  .create-note-title {
    font-size: 1.5rem;
    padding: 1rem;
    margin-bottom: .5rem;
    border: 1px solid transparent;
    border-radius: 4px;
    font-family: inherit;
    background: transparent;
    transition: all 0.2s ease;
    width: 100%;
    box-sizing: border-box;
  }
  
  .create-note-title:focus {
    border-color: #ddd;
    background-color: rgba(255, 255, 255, 0.9);
    outline: none;
  }
  
  .create-note-submit:hover {
    background-color: #0056b3;
  }
  .root-container {
    width: 100vw;
    height: 100vh;
    background-color: #ffffff;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: Arial, sans-serif;
    color: #000000;
    position: relative;
    overflow: hidden;
  }
  .content-container {
    width: 100%;
    height: 100%;
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    background-color: #ffffff;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    box-sizing: border-box;
    overflow: hidden;
  }

  .desktop-layout {
    height: 100vh;
    display: flex;
    flex-direction: column;
    max-width: 100%;
  }
  .desktop-grid {
    flex: 1;
    display: grid;
    grid-template-columns: 350px 1fr;
    gap: 0;
    padding: 0;
    height: calc(100vh - 60px);
    overflow: hidden;
  }
  .desktop-sidebar, .desktop-main {
    overflow-y: auto;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .desktop-sidebar {
    padding: 0;
  }
  
  .desktop-main {
    padding: 1rem;
    overflow-y: hidden;
  }
  .empty-state {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    font-size: 1.2rem;
    color: #666;
    text-align: center;
    padding: 2rem;
  }
  .create-note-view .tag-edit-input {
    padding: 1rem;
  }
  .create-note-view .submit-button {
    margin: 2rem;
  }

  /* Mobile */
  @media (max-width: 768px) {
    .header {
      position: sticky;
      top: 0;
      left: 0;
      right: 0;
      height: 60px;
      background-color: #ffffff;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      border-radius: 10px 10px 0 0;
      display: flex;
      align-items: center;
      padding: 0 1rem;
      z-index: 3;
    }
    .header img {
      height: 24px;
    }
    .home-section {
      display: flex;
      flex-direction: column;
      height: calc(100vh - 60px);
      overflow: hidden;
      gap: 0;
    }
    .note-header {
      padding: 0.5rem 1rem;
    }
    .create-note-button img {
      width: 40px;
      height: 40px;
    }
    .modal-content {
      width: calc(100% - 2rem);
      margin: 1rem;
      padding: 1.25rem;
      max-height: 90vh;
      overflow-y: auto;
    }
    .note-edit-textarea {
      font-size: 1.35rem;
      padding: 1.25rem;
      line-height: 1.6;
    }

    .notes-list {
      padding: 1rem;
      gap: 1rem;
    }

    .note-tags {
      gap: 0.5rem;
      margin: 0.5rem 0;
    }
    .background-overlay {
      display: none;
    }

    .header img {
      height: 24px;
    }
    .search-bar-wrapper {
      top: 100px;
      padding: 1rem;
      position: sticky;
      background: white;
    }
    .search-input {
      font-size: 1.1rem;
      padding: 0.75rem;
      width: 100%;
    }
    .note-header {
      padding: 0.5rem 1rem;
    }
    .note-title {
      font-size: 1.3rem;
      line-height: 1.3;
    }
    .note-preview {
      font-size: 1rem;
      line-height: 1.4;
      max-height: 4.2em;
      overflow: hidden;
    }
    .create-note-button {
      width: 96px;
      height: 96px;
      bottom: max(env(safe-area-inset-bottom), 1.5rem);
      right: 1.5rem;
      z-index: 100;
    }
    .create-note-button img {
      width: 40px;
      height: 40px;
    }
    .modal-content {
      width: calc(100% - 2rem);
      margin: 1rem;
      padding: 1.25rem;
      max-height: 90vh;
      overflow-y: auto;
    }
    .note-edit-textarea {
      font-size: 1.35rem;
      padding: 1.25rem;
      line-height: 1.6;
    }

    /* Note View and Content */
    .note-view {
      grid-template-columns: 1fr;
      grid-template-rows: auto 1fr;
      height: 100vh;
    }
    .note-content {
      height: calc(100vh - 45px);
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
    }
    .notes-list {
      padding: 1rem;
      gap: 1rem;
    }
    /* Tags and Metadata */
    .note-metadata {
      padding: 0.875rem;
      font-size: 1rem;
      grid-gap: 0.75rem;
    }

    .note-tags {
      gap: 0.5rem;
      margin: 0.5rem 0;
    }
    .note-tag {
      padding: 0.375rem 0.75rem;
      font-size: 0.9rem;
    }
    /* Layout and Container */
    .create-note-content {
      padding: 0.5rem 1.8rem;
    }
    .note-top-bar {
      padding: 0.75rem 1.75rem;
    }
    .content-container {
      width: 100%;
      height: 100vh;
      border-radius: 0;
      margin: 0;
      padding: 0;
    }

    .search-bar-wrapper {
      padding: 1rem;
      position: sticky;
      top: 0;
      background: white;
      z-index: 10;
    }
    .search-input {
      font-size: 1.1rem;
      padding: 0.75rem;
      width: 100%;
    }
    .note-header {
      padding: 0.5rem 1rem;
    }
    .note-item {
      padding: 1rem;
      margin: 0;
      border-radius: 8px;
      width: 100%;
      box-sizing: border-box;
    }

    .note-preview {
      font-size: 1rem;
      line-height: 1.4;
      max-height: 4.2em;
      overflow: hidden;
    }
    .create-note-button {
      width: 96px;
      height: 96px;
      bottom: max(env(safe-area-inset-bottom), 1.5rem);
      right: 1.5rem;
      z-index: 100;
    }

    .note-view {
      grid-template-columns: 1fr;
      grid-template-rows: auto 1fr;
      height: 100vh;
    }
    .notes-list {
      padding: 1rem;
      gap: 1rem;
    }

    .note-tags {
      gap: 0.5rem;
      margin: 0.5rem 0;
    }
    .note-tag {
      padding: 0.375rem 0.75rem;
      font-size: 0.9rem;
    }
  }

  /* Tablet Breakpoint Styles */
  @media (max-width: 1024px) {
    .create-note-content {
      padding: 0.5rem 2rem;
    }
    .note-top-bar {
      padding: 0.75rem 2rem;
    }
    .content-container {
      width: 100%;
      height: 100vh;
      border-radius: 0;
      margin: 0;
      padding: 0;
    }
    
    .note-header {
      padding: 0.5rem 1.8rem;
    }
    


    .header {
      position: sticky;
      top: 0;
      left: 0;
      right: 0;
      height: 60px;
      background-color: #ffffff;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      border-radius: 10px 10px 0 0;
      display: flex;
      align-items: center;
      padding: 0 1.5rem;
      z-index: 3;
    }
    .header img {
      height: 24px;
    }
    .search-bar-wrapper {
      top: 100px;
      padding: 1.8rem;
      position: sticky;
      background: white;
    }
    .search-input {
      font-size: 1.1rem;
      padding: 1.25rem;
      width: calc(100% - 2.5rem);
    }
    .note-item {
      padding: 1.25rem;
      margin: 0;
      border-radius: 8px;
    }
    .note-title {
      font-size: 1.3rem;
      line-height: 1.3;
    }
    .note-preview {
      font-size: 1rem;
      line-height: 1.4;
      max-height: 4.2em;
      overflow: hidden;
    }
    .create-note-button {
      width: 96px;
      height: 96px;
      bottom: max(env(safe-area-inset-bottom), 1.5rem);
      right: 1.5rem;
      z-index: 100;
    }
    .create-note-button img {
      width: 40px;
      height: 40px;
    }
    .modal-content {
      width: calc(100% - 2rem);
      margin: 1rem;
      padding: 1.25rem;
      max-height: 90vh;
      overflow-y: auto;
    }
    .note-edit-textarea {
      font-size: 1.35rem;
      padding: 1.25rem;
      line-height: 1.6;
    }

    .note-view {
      grid-template-columns: 1fr;
      grid-template-rows: auto 1fr;
      height: 100vh;
    }
    .note-content {
      height: calc(100vh - 45px);
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
    }
    .notes-list {
      padding: 2rem;
      gap: 1rem;
      width: 100%;
      box-sizing: border-box;
    }
    .note-metadata {
      padding: 0.875rem;
      font-size: 1rem;
      grid-gap: 0.75rem;
    }

    .note-tags {
      gap: 0.5rem;
      margin: 0.5rem 0;
    }
    .note-tag {
      padding: 0.375rem 0.75rem;
      font-size: 0.9rem;
    }

    .note-view {
      grid-template-columns: 1fr;
      grid-template-rows: auto 1fr;
      gap: 1rem;
    }

    .home-section {
      display: flex;
      flex-direction: column;
      height: calc(100vh - 60px);
      overflow: hidden;
      gap: 0;
    }

    .search-bar-wrapper {
      position: sticky;
      top: 0;
      background: white;
      z-index: 10;
    }
    .desktop-grid {
      grid-template-rows: auto 1fr;
      gap: 0;
    }

  }

  /* Desktop Media Query (1025px+) */
  @media (min-width: 1025px) {
    .root-container {
      padding: 2rem;
      align-items: flex-start;
    }

    .header {
      grid-area: header;
      position: static;
      border-radius: 10px 10px 0 0;
    }
    
    .home-section {
      grid-area: list;
      border-right: 1px solid rgba(0, 0, 0, 0.1);
      max-height: calc(95vh - 60px);
      overflow-y: auto;
    }
    
    .note-view {
      grid-area: view;
      height: calc(95vh - 60px);
      border-radius: 0;
      display: grid;
      grid-template-rows: auto 1fr;
    }
    
    .notes-list {
      height: calc(100% - 60px);
      overflow-y: auto;
      padding: 1rem;
    }
    
    .search-bar-wrapper {
      position: sticky;
      top: 0;
      background: white;
      z-index: 3;
      padding: 1rem;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    }
    
    .note-content {
      padding: 0;
      overflow-y: auto;
    }
    
    .create-note-button {
      bottom: 2rem;
      right: 2rem;
    }

    .header {
      position: sticky;
      top: 0;
      left: 0;
      right: 0;
      height: 60px;
      background-color: #ffffff;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      border-radius: 10px 10px 0 0;
      display: flex;
      align-items: center;
      padding: 0 1.5rem;
      z-index: 3;
    }
    .header img {
      height: 30px;
      width: auto;
      object-fit: contain;
    }

    .background-overlay {
        display: none;
    }

    .desktop-layout {
      width: 100%;
      min-height: 100vh;
      overflow: hidden;
    }
    .content-container.desktop-layout {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }
    .desktop-layout .note-view {
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    .desktop-layout .note-content {
      flex: 1;
      overflow-y: auto;
    }
  }


`;

export default styles;