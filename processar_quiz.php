<?php
$json = file_get_contents('php://input');
$data = json_decode($json, true);

if ($data) {
    $nome    = strip_tags($data['nome']);
    $whatsapp = strip_tags($data['whatsapp']);
    $pontos  = $data['pontuacao'];
    $status  = $data['status'];
    $data_hr = $data['data'];

    // 1. Destinatário (E-mail da Escola)
    $para = "telsioisidoro786@gmail.com"; 
    $assunto = "Novo Quiz: Encarregado $nome ($status)";

    // 2. Mensagem HTML Estilizada
    $mensagem = "
    <html>
    <body style='font-family: sans-serif; color: #333;'>
        <div style='background: #01377d; color: white; padding: 20px; text-align: center;'>
            <h1>Resultado do Quiz de Desempenho</h1>
        </div>
        <div style='padding: 20px; border: 1px solid #eee;'>
            <p><strong>Encarregado:</strong> $nome</p>
            <p><strong>WhatsApp:</strong> $whatsapp</p>
            <p><strong>Pontuação:</strong> $pontos pontos</p>
            <p><strong>Categoria:</strong> <span style='color: #e6b325; font-weight: bold;'>$status</span></p>
            <p><strong>Data:</strong> $data_hr</p>
        </div>
    </body>
    </html>
    ";

    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= "From: telsioisidoro786@gmail.com";

    // Enviar o e-mail
    mail($para, $assunto, $mensagem, $headers);

    // 3. Guardar no Arquivo para o teu relatório (Excel ready)
    // Usamos o ponto e vírgula (;) para ser fácil de abrir no Excel depois
    $linha = "$data_hr; $nome; $whatsapp; $pontos; $status" . PHP_EOL;
    file_put_contents('base_dados_quiz.txt', $linha, FILE_APPEND);
}
?>