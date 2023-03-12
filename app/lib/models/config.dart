class Config {
  final String name;
  final String fqdn;
  final String? apiKey;

  const Config(this.name, this.fqdn, this.apiKey);

  Config.fromJson(Map<String, dynamic> json)
      : apiKey = json['apiKey'],
        fqdn = json['fqdn'],
        name = json['name'];

  Map<String, dynamic> toJson() =>
      {'name': name, 'fqdn': fqdn, 'apiKey': apiKey};
}
