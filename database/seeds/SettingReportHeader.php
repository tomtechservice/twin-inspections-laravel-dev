<?php

use Illuminate\Database\Seeder;

class SettingReportHeader extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('setting')->update([
            'work_contract_headerbox' => '<table style="border-collapse: collapse; border-spacing: 0; width: 100%; border: 1px solid black;">
            <tbody>
            <tr>
            <td style="border: 1px solid black; padding: 5px;">Building No: {%building_no%}</td>
            <td style="border: 1px solid black; padding: 5px;">Street:{%street%}</td>
            <td style="border: 1px solid black; padding: 5px;">City:{%city%}</td>
            <td style="border: 1px solid black; padding: 5px;">Zip:{%zip%}</td>
            <td style="border: 1px solid black; padding: 5px;">Inspection Date:<br />{%inspection_date%}</td>
            </tr>
            </tbody>
            </table>
            <table style="width: 100%; font-size: 14px;" cellpadding="4">
            <tbody>
            <tr>
            <td width="25% padding:5px;">{%logo%}</td>
            <td width="44% padding:5px;">{%company_name%}<br />{%address_1%} , {%address_2%} <br />{%city%} , {%state%} {%zip%}<br />{%phone%}<br />{%fax%}<br />{%url%}</td>
            <td width="25% padding:5px;"><br /><br /><strong>Report #&nbsp;</strong>{%report_no%}</td>
            </tr>
            </tbody>
            </table>'
        ]);
    }
}
