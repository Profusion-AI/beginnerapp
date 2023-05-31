<?php
/**
 * Plugin Name: React Chatbot
 * Description: A chatbot interface built with React.
 * Version: 1.0
 */

function react_chatbot_enqueue_scripts() {
    wp_enqueue_script('react-chatbot', plugin_dir_url(__FILE__) . 'build/static/js/main.070e54a7.js', [], false, true);
}

add_action('wp_enqueue_scripts', 'react_chatbot_enqueue_scripts');

function react_chatbot_shortcode() {
    return '<div id="root"></div>';
}

add_shortcode('react_chatbot', 'react_chatbot_shortcode');
?>
