/**
 * BLUEPRINT MODAL SYSTEM (modals.js)
 * - Injects modal HTML into the page.
 * - Handles Open/Close logic globally.
 * - Manages Formspree submissions.
 */

window.BlueprintModals = {
    
    // 1. THE TEMPLATES (HTML STRUCTURE)
    templates: `
        <div id="techArchModal" class="fixed inset-0 modal-overlay flex items-center justify-center p-4 hidden z-50" style="background-color: rgba(0,0,0,0.8);">
            <div class="relative bg-white p-2 border border-gray-200 shadow-xl w-1/2 rounded-none">
                <button onclick="window.BlueprintModals.close('techArchModal')" class="absolute -top-3 -right-3 text-white bg-black hover:bg-gray-800 rounded-full w-8 h-8 flex items-center justify-center text-xl z-10">&times;</button>
                <div class="bg-gray-100 w-full h-96 flex items-center justify-center text-gray-500 font-mono text-xs border border-dashed border-gray-300">
                    [Technical Architecture Diagram]
                </div>
            </div>
        </div>

        <div id="amIReadyModal" class="fixed inset-0 modal-overlay flex items-center justify-center p-4 hidden z-50" style="background-color: rgba(0,0,0,0.8);">
            <div class="bg-white shadow-xl w-full max-w-3xl max-h-[95vh] flex flex-col border-t-8 border-blueprint-blue rounded-none">
                <header class="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 class="text-2xl font-bold text-gray-900">Are You Ready?</h2>
                    <button onclick="window.BlueprintModals.close('amIReadyModal')" class="text-gray-400 hover:text-gray-900 text-3xl">&times;</button>
                </header>
                <div class="p-6 overflow-y-auto custom-scrollbar text-sm space-y-3">
                    <p class="text-gray-500 mb-4">This tool is most effective when you can answer "yes" to all of the following statements:</p>
                    <div class="grid grid-cols-1 gap-y-4 text-gray-800">
                        <div class="flex items-start bg-gray-50 p-3 border border-gray-100"><input type="checkbox" class="checklist-item mr-3 h-4 w-4 mt-1 flex-shrink-0 accent-blue-600"><label>Do you currently have a Databricks Account?</label></div>
                        <div class="flex items-start bg-gray-50 p-3 border border-gray-100"><input type="checkbox" class="checklist-item mr-3 h-4 w-4 mt-1 flex-shrink-0 accent-blue-600"><label>Do you have a workspace setup to accept the notebook?</label></div>
                        <div class="flex items-start bg-gray-50 p-3 border border-gray-100"><input type="checkbox" class="checklist-item mr-3 h-4 w-4 mt-1 flex-shrink-0 accent-blue-600"><label>Do you have marketing data setup inside the workspace?</label></div>
                        <div class="flex items-start bg-gray-50 p-3 border border-gray-100"><input type="checkbox" class="checklist-item mr-3 h-4 w-4 mt-1 flex-shrink-0 accent-blue-600"><label>Are you using unity catalog?</label></div>
                        <div class="flex items-start bg-gray-50 p-3 border border-gray-100"><input type="checkbox" class="checklist-item mr-3 h-4 w-4 mt-1 flex-shrink-0 accent-blue-600"><label>Do you have a clear and consistent definition of what costs are included in your "Ad Spend"?</label></div>
                        <div class="flex items-start bg-gray-50 p-3 border border-gray-100"><input type="checkbox" class="checklist-item mr-3 h-4 w-4 mt-1 flex-shrink-0 accent-blue-600"><label>Do you have a basic understanding of your sales attribution model?</label></div>
                        <div class="flex items-start bg-gray-50 p-3 border border-gray-100"><input type="checkbox" class="checklist-item mr-3 h-4 w-4 mt-1 flex-shrink-0 accent-blue-600"><label>Does your team have the technical skills required to use this notebook?</label></div>
                        <div class="flex items-start bg-gray-50 p-3 border border-gray-100"><input type="checkbox" class="checklist-item mr-3 h-4 w-4 mt-1 flex-shrink-0 accent-blue-600"><label>Do you have a designated person responsible for maintaining the notebook?</label></div>
                        <div class="flex items-start bg-gray-50 p-3 border border-gray-100"><input type="checkbox" class="checklist-item mr-3 h-4 w-4 mt-1 flex-shrink-0 accent-blue-600"><label>Do you have a specific business question in mind for ROAS analysis?</label></div>
                    </div>
                </div>
                <div class="flex items-center justify-end space-x-4 p-6 border-t border-gray-100">
                    <button onclick="window.BlueprintModals.close('amIReadyModal')" class="px-6 py-2 text-xs font-bold uppercase text-gray-500 hover:text-gray-800">Close</button>
                    <button id="proceedToCartBtn" class="px-8 py-3 bg-blueprint-blue text-white font-bold uppercase tracking-widest text-[10px] hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled>Proceed to Cart</button>
                </div>
            </div>
        </div>

        <div id="contactSalesModal" class="fixed inset-0 modal-overlay flex items-center justify-center p-4 hidden z-50" style="background-color: rgba(0,0,0,0.8);">
            <div class="bg-white shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col border-t-8 border-black rounded-none">
                <header class="p-6 border-b border-gray-100 flex justify-between items-center">
                    <div>
                        <h2 class="text-2xl font-bold text-gray-900">Contact Sales</h2>
                        <p class="text-xs text-gray-500 mt-1 font-medium">
                            Call us at <a href="tel:2064558326" class="text-blueprint-blue hover:underline">(206) 455-8326</a> 
                            or email <a href="mailto:Info@bpcs.com" class="text-blueprint-blue hover:underline">Info@bpcs.com</a>
                        </p>
                    </div>
                    <button onclick="window.BlueprintModals.close('contactSalesModal')" class="text-gray-400 hover:text-gray-900 text-2xl">&times;</button>
                </header>
                <form id="contactSalesForm" action="https://formspree.io/f/mgozdqkj" method="POST" class="p-8 space-y-4">
                     <input type="hidden" name="form_subject" value="New Sales Inquiry from Marketplace">
                     <input type="hidden" name="product_page" id="hiddenPageTitle" value="">

                     <div>
                         <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Full Name</label>
                         <input type="text" name="fullName" required class="w-full border border-gray-300 p-3 focus:border-blueprint-blue">
                     </div>
                     <div>
                         <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Business Email</label>
                         <input type="email" name="email" required class="w-full border border-gray-300 p-3 focus:border-blueprint-blue">
                     </div>
                     <div>
                         <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Message</label>
                         <textarea name="message" rows="4" required class="w-full border border-gray-300 p-3 focus:border-blueprint-blue"></textarea>
                     </div>
                     <div class="flex flex-col gap-2 mt-4">
                        <button type="submit" class="w-full py-4 bg-black text-white font-bold uppercase tracking-widest text-xs hover:bg-gray-800 transition-colors">Send Message</button>
                        <button type="button" onclick="window.BlueprintModals.close('contactSalesModal')" class="w-full py-2 text-xs font-bold uppercase text-gray-400 hover:text-gray-800">Cancel</button>
                    </div>
                </form>
            </div>
        </div>

        <div id="messageSentModal" class="fixed inset-0 modal-overlay flex items-center justify-center p-4 hidden z-50" style="background-color: rgba(0,0,0,0.8);">
            <div class="bg-white shadow-xl w-full max-w-md text-center p-8 border-t-8 border-green-500 rounded-none">
                 <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                     <svg class="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                 </div>
                <h2 class="text-xl font-bold text-gray-900 mb-2">Message Sent!</h2>
                <p class="text-gray-500 mb-6 text-sm">Our sales team will get back to you shortly.</p>
                <button onclick="window.BlueprintModals.close('messageSentModal')" class="mt-4 text-xs font-bold uppercase text-blueprint-blue hover:underline">Close</button>
            </div>
        </div>
    `,

    // 2. INITIALIZE (Injects HTML into page)
    init() {
        if (!document.getElementById('blueprint-modals-container')) {
            const container = document.createElement('div');
            container.id = 'blueprint-modals-container';
            container.innerHTML = this.templates;
            document.body.appendChild(container);
            
            this.attachLogic();
        }
    },

    // 3. LOGIC HANDLERS (Open/Close)
    open(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden'; // Lock scroll
        } else {
            console.error('Modal not found:', modalId);
        }
    },

    close(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = ''; // Unlock scroll
        }
    },

    // 4. ATTACH EVENT LISTENERS
    attachLogic() {
        // --- Logic for "Am I Ready?" Checklist ---
        const checklistItems = document.querySelectorAll('#amIReadyModal .checklist-item');
        const proceedBtn = document.getElementById('proceedToCartBtn');
        
        if (checklistItems.length > 0 && proceedBtn) {
            checklistItems.forEach(item => {
                item.addEventListener('change', () => {
                    const allChecked = Array.from(checklistItems).every(i => i.checked);
                    proceedBtn.disabled = !allChecked;
                });
            });

            proceedBtn.addEventListener('click', () => {
                // Add default item to Cart if global Cart object exists
                if (typeof Cart !== 'undefined') {
                    Cart.add({ 
                        id: 'ciq-1', 
                        title: 'CampaignIQ - Single User', 
                        price: 1000, 
                        type: 'Software', 
                        billing: 'monthly' 
                    });
                }
                this.close('amIReadyModal');
            });
        }

        // --- Logic for "Contact Sales" Form ---
        const form = document.getElementById('contactSalesForm');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault(); // Stop normal submission
                
                // Scrape page title
                const titleField = document.getElementById('hiddenPageTitle');
                if(titleField) titleField.value = document.title;
                
                const btn = form.querySelector('button[type="submit"]');
                const originalText = btn.innerText;
                btn.innerText = "Sending...";
                btn.disabled = true;

                const formData = new FormData(form);
                
                try {
                    const response = await fetch(form.action, {
                        method: 'POST',
                        body: formData,
                        headers: { 'Accept': 'application/json' }
                    });

                    if (response.ok) {
                        this.close('contactSalesModal');
                        form.reset();
                        this.open('messageSentModal');
                    } else {
                        alert('Error submitting form. Please try again.');
                    }
                } catch (error) {
                    console.error(error);
                    alert('Network error. Please check your connection.');
                } finally {
                    btn.innerText = originalText;
                    btn.disabled = false;
                }
            });
        }
    }
};

// Auto-initialize when the script loads
document.addEventListener('DOMContentLoaded', () => window.BlueprintModals.init());
