class Config {
  final String id;
  final String name;
  final String fqdn;
  final String? apiKey;

  const Config(this.id, this.name, this.fqdn, this.apiKey);

  Config.fromJson(Map<String, dynamic> json)
      : id = json['id'],
        apiKey = json['apiKey'],
        fqdn = json['fqdn'],
        name = json['name'];

  Map<String, dynamic> toJson() =>
      {'id': id, 'name': name, 'fqdn': fqdn, 'apiKey': apiKey};
}
