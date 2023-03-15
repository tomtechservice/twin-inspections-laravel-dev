<?php

use Illuminate\Database\Seeder;

class SettingTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('setting')->update([
            'work_contract_text' => '<p>&nbsp;</p>
            <p>Items on the report may contain provisions for additional costs over and above the original estimate. Please read the report carefully and completely.</p>
            <p>&nbsp;</p>
            <p>CONDITIONS:</p>
            <p>&nbsp;</p>
            <p>1.This offer is limited to 5 months from the date of the report.</p>
            <p>&nbsp;</p>
            <p>2. If further inspection is recommended, or if additional work is required, we will provide prices or recommendations for correction. All termite treatments have a one (1) year guarantee unless Extended Termite Protection Service has been purchased for additional years. The estimates for repairs include one (1) coat of primer painting of new exterior wood members, in the event that pre-primed wood is not used, weather permitting. Finish paint can be added to the scope of work if requested before the start of the job. Painting will be additionally billed at $85/hour plus the cost of materials. Interested parties will be notified prior to any work being done.</p>
            <p>&nbsp;</p>
            <p>3. If during the course of repairs it is found that the height of the structure/zero property lines/abutting structures/etc prevent access to areas with a standard ladder, owner and/or agent will be contacted immediately to review a further/alternate course of action.</p>
            <p>&nbsp;</p>
            <p>4. Notice to owner of Mechanic\'s Lien as required by the Structural Pest Control Board: Under the California Mechanics Lien Law, any structural pest control operator who contracts to do work for you, any contractor, subcontractor, laborer, supplier or other person who helps to improve your property, but is not paid for his work or supplies, has a right to enforce a claim against your property. This means that after a court hearing, your property could be sold by a court officer and the proceeds of the sale used to satisfy the indebtedness. This can happen even if you have paid your contractor in full if the subcon tractor, laborers or suppliers remain unpaid. To preserve their right to file a claim or lien against your property, certain claimants such as subcontractors or material suppliers are required to provide you with a document entitled "Preliminary Notice". General contractors and laborers for wages do not have to provide this notice. A Preliminary Notice is not a lien against your property. Its purpose is to notify you of persons who may have a right to file a lien against your property if they are not paid.</p>
            <p>&nbsp;</p>
            <p>5. ATTORNEY FEES: The prevailing party shall have the right to collect from the other party its reason able costs and necessary disbursements and attorneys\' fees incurred in enforcing this Agreement.</p>
            <p>&nbsp;</p>
            <p>6. We will use due caution and diligence in their operations and care will always be taken to minimize any damage, but assumes no responsibility for matching existing colors and styles, or for incidental damage to roof coverings, TV antennas, solar panels, rain gutters, plant life, paint or wall coverings. We are not responsible for personal property. There may be health related issues associated with the structural repairs reflected in the inspection report referenced by this work authorization contract. These health issues include but are not limited to the possible release of mold spores during the course of repairs. We are not qualified to and do not render any opinion concerning such health issues or any special precautions. Any questions concerning health issues or any special precautions to be taken prior to or during the course of such repairs should be directed to a Certified Industrial Hygienist before any such repairs are undertaken. By executing this work authorization contract, customer acknowledges that he or she has been advised of the foregoing and has had the opportunity to consult with a qualified professional.</p>
            <p>&nbsp;</p>
            <p>7. This report is limited to the accessible areas of the structure shown on the diagram. Please refer to the report for areas not inspected and further information.</p>
            <p>&nbsp;</p>
            <p>8. TERMS OF PAYMENT (please choose option 8 or 9 as applicable). We agree to pay the sum of {%amount%} upon completion of repairs. Note: TWIN HOME SERVICES REQUIRES A CREDIT CARD BE PLACED ON FILE TO SECURE THE APPOINTMENT. (SEE BELOW) This card can be charged upon completion of the work or shredded upon collection of a check at the property.</p>
            <p>&nbsp;</p>
            <p>9. We instruct {%name%}, holder of escrow number {%number%} to pay the sum of {%sum_amount%} upon close of escrow. Close of escrow date {%date%} Phone {%phone%}, Escrow Officer {%officer_name%} Email {%escrow_email%}. (PLEASE NOTE: TWIN HOME SERVICES REQUIRES A CREDIT CARD BE PLACED ON FILE AS A BACKUP WHEN INVOICING ESCROW.) We understand that we are responsible for payment, and if escrow does not close within 30 days of completion of work we will be charged the amount due in full, and upon notification late fees may apply if payment is not authorized.</p>
            <p>&nbsp;</p>
            <p>10. We authorize this company to perform items {%field_items%} for a contract price of {%price%}(Job minimum is $250).</p>
            <p>&nbsp;</p>
            <p>NAME OF PERSON TO CONTACT FOR ACCESS: {%field_user%} PHONE # {%field_user_phone%}</p>
            <p>&nbsp;</p>
            <p>SIGNED {%signature-pad%} (Owner or Owner\'s Agent) DATE {%sign_date%}</p>
            <p>&nbsp;</p>
            <p>Owner Name (Please Print) {%owner_name%} Owner Mailing Address (Please Print){%address%}</p>
            <p>&nbsp;</p>
            <p>It is assumed that if an agent orders work on the owners behalf, and that they were notified prior by said agent, that if payment is not made by the agent or escrow company it will be the responsibility of the owner to produce payment. The credit card to be used as a backup can be called into the office or filled out below and faxed/emailed into.</p>'
        ]);
    }
}
