from django.db import models

# Define as tabelas do banco de dados
class Pessoa(models.Model):
    nome = models.CharField(max_length=100)
    ano = models.IntegerField(default=0)
    oculos = models.JSONField(default=list) 
    tatuagem = models.JSONField(default=list) 
    altura = models.IntegerField(default=0)  
    area_estudo = models.CharField(max_length=100, default="não informado")
    time = models.CharField(max_length=100, default="nenhum")

    def __str__(self):
        return self.nome

    def get_feedback(self, tentativa):
        """
        tentativa: dict com os valores que o jogador chutou.
        Ex: {'ano': 2001, 'oculos': 'sim'}

        Retorna: dict com status para cada campo.
        """
        campos = [field.name for field in self._meta.fields if field.name not in ['id', 'nome']]
        feedback = {}
        for field in campos:
            valor_correto = getattr(self, field)
            valor_tentado = tentativa.get(field)

            # caso o valor correto seja lista (como 'oculos')
            if isinstance(valor_correto, list):
                if valor_tentado in valor_correto:
                    status = 'meio' if len(valor_correto) > 1 else 'certo'
                else:
                    status = 'errado'
            else:
                status = 'certo' if valor_tentado == valor_correto else 'errado'

            feedback[field] = status

        return feedback


class Jogo(models.Model):
    MODOS = {
        ('normal', 'Normal'),
        ('frase', 'Frase'),
    }

    jogador = models.CharField(max_length=100)
    alvo = models.ForeignKey(Pessoa, on_delete=models.CASCADE, related_name='jogos_como_alvo')
    tentativas = models.IntegerField(default=0)
    concluido = models.BooleanField(default=False)
    data = models.DateTimeField(auto_now_add=True)
    modo = models.CharField(max_length=10, choices=MODOS, default='normal')

    def __str__(self):
        return f"{self.jogador} ({self.modo}) tentando {self.alvo.nome}"
