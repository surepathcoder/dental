<?php
/**
 * Plugin Name: BrightSmile AI Receptionist
 * Description: Adds the BrightSmile dental AI receptionist to every public page of this WordPress site. Hours, insurance, booking and leads stay in one clinic dashboard.
 * Version: 1.0.0
 * Requires at least: 6.0
 * Requires PHP: 7.4
 * Author: BrightSmile
 * License: GPL-2.0-or-later
 */

if (!defined('ABSPATH')) {
    exit;
}

function brightsmile_receptionist_register_settings()
{
    register_setting('brightsmile_receptionist', 'brightsmile_origin', [
        'type' => 'string',
        'sanitize_callback' => 'esc_url_raw',
        'default' => '',
    ]);
    register_setting('brightsmile_receptionist', 'brightsmile_color', [
        'type' => 'string',
        'sanitize_callback' => 'sanitize_hex_color',
        'default' => '#0f6b70',
    ]);
    register_setting('brightsmile_receptionist', 'brightsmile_label', [
        'type' => 'string',
        'sanitize_callback' => 'sanitize_text_field',
        'default' => 'Ask our AI receptionist',
    ]);
}
add_action('admin_init', 'brightsmile_receptionist_register_settings');

function brightsmile_receptionist_menu()
{
    add_options_page(
        'AI Receptionist',
        'AI Receptionist',
        'manage_options',
        'brightsmile-receptionist',
        'brightsmile_receptionist_settings_page'
    );
}
add_action('admin_menu', 'brightsmile_receptionist_menu');

function brightsmile_receptionist_settings_page()
{
    if (!current_user_can('manage_options')) {
        return;
    }
    $origin = (string) get_option('brightsmile_origin', '');
    $color = (string) get_option('brightsmile_color', '#0f6b70');
    $label = (string) get_option('brightsmile_label', 'Ask our AI receptionist');
    ?>
    <div class="wrap">
        <h1>BrightSmile AI Receptionist</h1>
        <p>Keep this WordPress site. Paste the hosted app URL we gave your practice. The chat button appears on every public page; conversations and bookings land in your clinic dashboard.</p>
        <form method="post" action="options.php">
            <?php settings_fields('brightsmile_receptionist'); ?>
            <table class="form-table" role="presentation">
                <tr>
                    <th scope="row"><label for="brightsmile_origin">Hosted app URL</label></th>
                    <td>
                        <input type="url" class="regular-text" id="brightsmile_origin" name="brightsmile_origin" value="<?php echo esc_attr($origin); ?>" placeholder="https://app.yourpractice.com" required>
                        <p class="description">Example: <code>https://app.yourpractice.com</code> — no trailing slash needed.</p>
                    </td>
                </tr>
                <tr>
                    <th scope="row"><label for="brightsmile_color">Button color</label></th>
                    <td><input type="text" class="regular-text" id="brightsmile_color" name="brightsmile_color" value="<?php echo esc_attr($color ?: '#0f6b70'); ?>" placeholder="#0f6b70"></td>
                </tr>
                <tr>
                    <th scope="row"><label for="brightsmile_label">Button label</label></th>
                    <td><input type="text" class="regular-text" id="brightsmile_label" name="brightsmile_label" value="<?php echo esc_attr($label); ?>" maxlength="80"></td>
                </tr>
            </table>
            <?php submit_button('Save and show chat on the website'); ?>
        </form>
    </div>
    <?php
}

function brightsmile_receptionist_enqueue()
{
    if (is_admin()) {
        return;
    }
    $origin = rtrim((string) get_option('brightsmile_origin', ''), '/');
    if ($origin === '') {
        return;
    }
    wp_enqueue_script('brightsmile-widget', $origin . '/widget.js', [], '1.0.0', true);
}
add_action('wp_enqueue_scripts', 'brightsmile_receptionist_enqueue');

function brightsmile_receptionist_script_attrs($tag, $handle)
{
    if ($handle !== 'brightsmile-widget') {
        return $tag;
    }
    $color = (string) get_option('brightsmile_color', '#0f6b70');
    $label = (string) get_option('brightsmile_label', 'Ask our AI receptionist');
    $origin = rtrim((string) get_option('brightsmile_origin', ''), '/');
    $attrs = ' data-color="' . esc_attr($color ?: '#0f6b70') . '" data-label="' . esc_attr($label) . '" data-origin="' . esc_attr($origin) . '" async';
    return str_replace(' src=', $attrs . ' src=', $tag);
}
add_filter('script_loader_tag', 'brightsmile_receptionist_script_attrs', 10, 2);
